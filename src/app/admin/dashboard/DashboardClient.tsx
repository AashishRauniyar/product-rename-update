/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  BarChart2,
  Eye,
  Globe,
  Plus,
  Edit,
  FolderOpen,
  Package,
  Files,
  ChevronUp,
  ChevronDown,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Product = {
  id: string;
  old_name: string;
  new_name: string;
  category_id?: string;
  category_name?: string;
  description?: string;
  old_images: string; // JSON stringified array
  new_images: string; // JSON stringified array
  next_redirect_url: string;
  theme: string;
  generated_link: string;
  domain?: string;
  total_clicks: number;
  created_at?: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  description_points: string[];
  product_count: number;
  created_at: string;
};

// Type for analytics data
type AnalyticsData = {
  totalProducts: number;
  totalClicks: number;
  totalUniqueVisitors: number;
  topCountries: { country: string; count: number }[];
  products: Product[];
};

// Type for individual product analytics
type ProductAnalytics = {
  totalClicks: number;
  uniqueVisitors: number;
  countries: { country: string; count: number }[];
};

// Custom colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

export default function DashboardClient({ user }: { user?: any }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    description_points: ["", "", "", ""]
  });
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("yearly");

  // New state for enhanced filtering, sorting, and pagination
  const [sortField, setSortField] = useState<keyof Product>("total_clicks");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [filterTheme, setFilterTheme] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all products and analytics data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`
        );
        setProducts(productsRes.data);

        // Fetch categories
        const categoriesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`
        );
        setCategories(categoriesRes.data);

        // Calculate analytics from products data
        const totalProducts = productsRes.data.length;
        const totalClicks = productsRes.data.reduce((sum: number, product: Product) => sum + (product.total_clicks || 0), 0);
        
        setAnalytics({
          totalProducts,
          totalClicks,
          totalUniqueVisitors: 0, // This would need a separate endpoint if needed
          topCountries: [], // This would need a separate endpoint if needed
          products: productsRes.data
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    });
  };

  // Copy a given link to clipboard
  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Copy error:", error);
      alert("Failed to copy link.");
    }
  };

  // Redirect to edit page
  const handleEdit = (id: string) => {
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/admin/edit-product/${id}`);
  };

  // Delete product and refresh list
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/product/${id}`
        );
        alert("Product deleted successfully");
        
        // Refresh products list
        try {
          const productsRes = await axios.get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`
          );
          setProducts(productsRes.data);
        } catch (refreshError) {
          console.warn("Failed to refresh products after delete:", refreshError);
          // Don't show error to user - the delete was successful
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete product.");
      }
    }
  };

  // View detailed analytics for a product
  const handleViewAnalytics = (id: string) => {
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/admin/analytics/${id}`);
  };

  // Duplicate product
  const handleDuplicate = async (id: string) => {
    if (confirm("Are you sure you want to duplicate this product?")) {
      try {
        // First, get the product data
        const productRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/product/${id}`
        );
        const productData = productRes.data;

        if (!productData) {
          alert("Failed to fetch product data.");
          return;
        }

        // Prepare the form data for duplication
        const formData = new FormData();
        
        // Basic product info - append "(Copy)" to names to distinguish
        formData.append("old_name", `${productData.old_name} (Copy)`);
        formData.append("new_name", `${productData.new_name} (Copy)`);
        
        // Category
        if (productData.category_id) {
          formData.append("category_id", productData.category_id);
        }
        
        // Images (JSON strings)
        formData.append("old_images_existing", JSON.stringify(productData.old_images || []));
        formData.append("new_images_existing", JSON.stringify(productData.new_images || []));
        
        // Badge images
        if (productData.badge_image_url) {
          formData.append("badge_image_existing", productData.badge_image_url);
        }
        if (productData.extra_badge_1) {
          formData.append("extra_badge_1_existing", productData.extra_badge_1);
        }
        if (productData.extra_badge_2) {
          formData.append("extra_badge_2_existing", productData.extra_badge_2);
        }
        
        // Configuration
        formData.append("next_redirect_url", productData.next_redirect_url || "");
        formData.append("redirect_timer", (productData.redirect_timer || 7).toString());
        formData.append("theme", productData.theme || "light");
        formData.append("domain", productData.domain || "");
        
        // SEO
        formData.append("meta_description", productData.meta_description || "");
        formData.append("seo_title", productData.seo_title || "");

        // Make the API call to create the duplicate
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status >= 200 && response.status < 300) {
          alert("Product duplicated successfully!");
          
          // Refresh the products list
          try {
            const productsRes = await axios.get(
              `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`
            );
            setProducts(productsRes.data);
          } catch (refreshError) {
            console.warn("Failed to refresh products after duplicate:", refreshError);
            // Don't show error to user - the duplication was successful
          }
        } else {
          throw new Error(`Failed to duplicate product: ${response.status}`);
        }
      } catch (error) {
        console.error("Duplicate error:", error);
        alert("Failed to duplicate product. Please try again.");
      }
    }
  };

  // ===== CATEGORY MANAGEMENT FUNCTIONS =====

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Reset category form
  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      description_points: ["", "", "", ""]
    });
    setEditingCategory(null);
    setShowCreateCategory(false);
  };

  // Handle create category
  const handleCreateCategory = async () => {
    try {
      setCategoryLoading(true);
      const validPoints = categoryForm.description_points.filter(point => point.trim());
      
      if (!categoryForm.name.trim() || !categoryForm.description.trim() || validPoints.length === 0) {
        alert("Please fill in all required fields");
        return;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`, {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        description_points: validPoints
      });

      alert("Category created successfully!");
      resetCategoryForm();
      fetchCategories();
    } catch (error: any) {
      console.error("Error creating category:", error);
      alert(error.response?.data?.error || "Failed to create category");
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      description_points: [...category.description_points, ...["", "", "", ""]].slice(0, 4)
    });
    setShowCreateCategory(true);
  };

  // Handle update category
  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      setCategoryLoading(true);
      const validPoints = categoryForm.description_points.filter(point => point.trim());
      
      if (!categoryForm.name.trim() || !categoryForm.description.trim() || validPoints.length === 0) {
        alert("Please fill in all required fields");
        return;
      }

      await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories/${editingCategory.id}`, {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        description_points: validPoints
      });

      alert("Category updated successfully!");
      resetCategoryForm();
      fetchCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      alert(error.response?.data?.error || "Failed to update category");
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (category: Category) => {
    if (category.product_count > 0) {
      alert(`Cannot delete category "${category.name}". It is assigned to ${category.product_count} product(s). Please reassign the products to a different category first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories/${category.id}`);
        alert("Category deleted successfully!");
        fetchCategories();
      } catch (error: any) {
        console.error("Error deleting category:", error);
        alert(error.response?.data?.error || "Failed to delete category");
      }
    }
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedProducts = (() => {
    const filtered = products.filter((product) => {
      // Text search
      const matchesSearch = 
        product.new_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.old_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.domain && product.domain.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = filterCategory === "all" || 
        (filterCategory === "no-category" && !product.category_name) ||
        product.category_name === filterCategory;

      // Domain filter
      const matchesDomain = filterDomain === "all" || 
        (filterDomain === "no-domain" && !product.domain) ||
        product.domain === filterDomain;

      // Theme filter
      const matchesTheme = filterTheme === "all" || product.theme === filterTheme;

      return matchesSearch && matchesCategory && matchesDomain && matchesTheme;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle special cases
      if (sortField === "category_name") {
        aValue = aValue || "No Category";
        bValue = bValue || "No Category";
      } else if (sortField === "domain") {
        aValue = aValue || "No Domain";
        bValue = bValue || "No Domain";
      } else if (sortField === "total_clicks") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      // Convert to comparable values
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  })();

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterDomain, filterTheme, sortField, sortDirection]);

  // Get unique values for filters
  const uniqueCategories = [...new Set(products.map(p => p.category_name).filter(Boolean))];
  const uniqueDomains = [...new Set(products.map(p => p.domain).filter(Boolean))];
  const uniqueThemes = [...new Set(products.map(p => p.theme).filter(Boolean))];

  // Sorting handler
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterDomain("all");
    setFilterTheme("all");
    setSortField("total_clicks");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: keyof Product }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Prepare data for country distribution pie chart
  const countryPieData =
    analytics?.topCountries.map((country) => ({
      name: country.country,
      value: country.count,
    })) || [];

  // Format products data for bar chart (top 5 products by views)
  const productBarData =
    analytics?.products.slice(0, 5).map((product) => ({
      name: product.new_name || product.old_name,
      clicks: product.total_clicks || 0,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto p-6">
        <Tabs defaultValue="products" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your product listings and view analytics
              </p>
            </div>
            <TabsList className="mt-4 sm:mt-0">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalProducts || products.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {products.length > 0
                      ? "View all products below"
                      : "Add your first product"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalClicks || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all products
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unique Visitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalUniqueVisitors || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Unique IP addresses
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Product Listings</CardTitle>
                    <CardDescription>
                      Manage your product catalog ({filteredAndSortedProducts.length} of {products.length} products)
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-8 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                    <Button onClick={() => router.push("/admin/upload")}>
                      Add New Product
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="no-category">No Category</SelectItem>
                            {uniqueCategories.map((category) => (
                              <SelectItem key={category} value={category || ""}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Domain</label>
                        <Select value={filterDomain} onValueChange={setFilterDomain}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Domains" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Domains</SelectItem>
                            <SelectItem value="no-domain">No Domain</SelectItem>
                            {uniqueDomains.map((domain) => (
                              <SelectItem key={domain} value={domain || ""}>
                                {domain}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Theme</label>
                        <Select value={filterTheme} onValueChange={setFilterTheme}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Themes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Themes</SelectItem>
                            {uniqueThemes.map((theme) => (
                              <SelectItem key={theme} value={theme}>
                                {theme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Items per page</label>
                        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="25">25 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                      </div>
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border">
                  {paginatedProducts.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted/50">
                        <tr>
                          <th 
                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort("new_name")}
                          >
                            <div className="flex items-center gap-2">
                              Product Details
                              <SortIcon field="new_name" />
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort("category_name")}
                          >
                            <div className="flex items-center gap-2">
                              Category
                              <SortIcon field="category_name" />
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort("domain")}
                          >
                            <div className="flex items-center gap-2">
                              Domain
                              <SortIcon field="domain" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Configuration
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort("total_clicks")}
                          >
                            <div className="flex items-center gap-2">
                              Analytics
                              <SortIcon field="total_clicks" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Images
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-gray-200">
                        {paginatedProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-muted/20">
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {product.new_name || product.old_name}
                                </span>
                                <span className="text-sm text-muted-foreground mt-1">
                                  ID: {product.id.substring(0, 8)}...
                                </span>
                                {product.description && (
                                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                                    {product.description?.length > 100
                                      ? `${product.description.substring(
                                          0,
                                          100
                                        )}...`
                                      : product.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium text-sm">
                                  {product.category_name || 'No Category'}
                                </span>
                              </div>
                              {!product.category_name && (
                                <p className="text-xs text-amber-600 mt-1">
                                  ⚠️ Legacy product - needs category
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium text-sm">
                                  {product.domain || 'No Domain'}
                                </span>
                              </div>
                              {!product.domain && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Domain not specified
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col space-y-2">
                                <div>
                                  <span className="text-xs text-muted-foreground">
                                    Theme:
                                  </span>
                                  <span className="ml-2 text-sm">
                                    {product.theme || "Default"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-muted-foreground">
                                    Redirect URL:
                                  </span>
                                  <span className="ml-2 text-sm">
                                    {product.next_redirect_url || "None"}
                                  </span>
                                </div>
                                {product.generated_link && (
                                  <div className="flex items-center mt-2">
                                    <a
                                      href={product.generated_link}
                                      className="text-primary text-sm flex items-center mr-2"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      View
                                    </a>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() =>
                                        handleCopyLink(product.generated_link)
                                      }
                                    >
                                      <Copy className="h-3 w-3 mr-1" />
                                      Copy Link
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{product.total_clicks || 0} views</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() =>
                                    handleViewAnalytics(product.id)
                                  }
                                >
                                  <BarChart2 className="h-3 w-3 mr-1" />
                                  View Stats
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-xs text-muted-foreground block mb-1">
                                    Old:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {JSON.parse(product.old_images || "[]")
                                      .slice(0, 3)
                                      .map((img: string, index: number) => (
                                        <img
                                          key={index}
                                          src={
                                            img ||
                                            "/placeholder.svg?height=48&width=48" ||
                                            "/placeholder.svg"
                                          }
                                          alt={`Old image ${index + 1}`}
                                          className="h-12 w-12 object-cover rounded border"
                                        />
                                      ))}
                                    {JSON.parse(product.old_images || "[]")
                                      .length > 3 && (
                                      <div className="h-12 w-12 flex items-center justify-center bg-muted rounded border">
                                        <span className="text-xs">
                                          +
                                          {JSON.parse(
                                            product.old_images || "[]"
                                          ).length - 3}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs text-muted-foreground block mb-1">
                                    New:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {JSON.parse(product.new_images || "[]")
                                      .slice(0, 3)
                                      .map((img: string, index: number) => (
                                        <img
                                          key={index}
                                          src={
                                            img ||
                                            "/placeholder.svg?height=48&width=48" ||
                                            "/placeholder.svg"
                                          }
                                          alt={`New image ${index + 1}`}
                                          className="h-12 w-12 object-cover rounded border"
                                        />
                                      ))}
                                    {JSON.parse(product.new_images || "[]")
                                      .length > 3 && (
                                      <div className="h-12 w-12 flex items-center justify-center bg-muted rounded border">
                                        <span className="text-xs">
                                          +
                                          {JSON.parse(
                                            product.new_images || "[]"
                                          ).length - 3}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleEdit(product.id)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="w-full justify-start"
                                  onClick={() => handleDuplicate(product.id)}
                                >
                                  <Files className="h-4 w-4 mr-2" />
                                  Duplicate
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="w-full justify-start"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No products found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || filterCategory !== "all" || filterDomain !== "all" || filterTheme !== "all"
                          ? "Try adjusting your search or filters"
                          : "Get started by creating your first product"}
                      </p>
                      {(searchTerm || filterCategory !== "all" || filterDomain !== "all" || filterTheme !== "all") && (
                        <div className="mt-6">
                          <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
                    <div className="flex items-center text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} results
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                          if (pageNumber > totalPages) return null;
                          
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentPage === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(pageNumber)}
                              className="min-w-[32px]"
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {categories.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Content templates available
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categories in Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {categories.filter(cat => cat.product_count > 0).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Categories with products
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Empty Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {categories.filter(cat => cat.product_count === 0).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Can be safely deleted
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Category Management</CardTitle>
                    <CardDescription>
                      Create and manage product content categories
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search categories..."
                        className="pl-8 w-full sm:w-[250px]"
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => setShowCreateCategory(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border">
                  {filteredCategories.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Category Details
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Description Points
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Usage
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-gray-200">
                        {filteredCategories.map((category) => (
                          <tr key={category.id} className="hover:bg-muted/20">
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                  <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="font-medium">
                                    {category.name}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground max-w-md">
                                  {category.description?.length > 150
                                    ? `${category.description.substring(0, 150)}...`
                                    : category.description}
                                </p>
                                <span className="text-xs text-muted-foreground mt-2">
                                  Created: {new Date(category.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <ul className="text-sm space-y-1">
                                {category.description_points.slice(0, 3).map((point, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2 text-muted-foreground">•</span>
                                    <span>
                                      {point.length > 60 ? `${point.substring(0, 60)}...` : point}
                                    </span>
                                  </li>
                                ))}
                                {category.description_points.length > 3 && (
                                  <li className="text-xs text-muted-foreground">
                                    +{category.description_points.length - 3} more points
                                  </li>
                                )}
                              </ul>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">
                                  {category.product_count} products
                                </span>
                              </div>
                              {category.product_count > 0 && (
                                <p className="text-xs text-amber-600 mt-1">
                                  ⚠️ Cannot delete - has linked products
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="w-full justify-start"
                                  onClick={() => handleDeleteCategory(category)}
                                  disabled={category.product_count > 0}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">
                        {categorySearchTerm
                          ? "No categories match your search."
                          : "No categories available."}
                      </p>
                      {!categorySearchTerm && (
                        <Button
                          className="mt-4"
                          onClick={() => setShowCreateCategory(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Category
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category Create/Edit Modal */}
            {showCreateCategory && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </CardTitle>
                  <CardDescription>
                    {editingCategory 
                      ? 'Update the category details below'
                      : 'Create a reusable content template for your products'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Category Name *</label>
                    <Input
                      placeholder="e.g., Health Supplements, Electronics, etc."
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <textarea
                      placeholder="Describe this category and what products it's for..."
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className="mt-1 w-full min-h-20 px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description Points * (max 4)</label>
                    <div className="space-y-2 mt-1">
                      {categoryForm.description_points.map((point, index) => (
                        <Input
                          key={index}
                          placeholder={`Key point ${index + 1}...`}
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...categoryForm.description_points];
                            newPoints[index] = e.target.value;
                            setCategoryForm({...categoryForm, description_points: newPoints});
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add compelling bullet points that will appear on product pages
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={resetCategoryForm}
                    disabled={categoryLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                    disabled={categoryLoading}
                  >
                    {categoryLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalProducts || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalClicks || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unique Visitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalUniqueVisitors || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Views</CardTitle>
                  <CardDescription>
                    Most popular products based on view count
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productBarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="clicks"
                          fill="hsl(var(--primary))"
                          name="Total Views"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visitor Geography</CardTitle>
                  <CardDescription>
                    Breakdown of visitors by country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={countryPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {countryPieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>
                  Products with the highest view counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {product.new_name || product.old_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.total_clicks || 0} views
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAnalytics(product.id)}
                        >
                          <BarChart2 className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/admin/analytics")}
                >
                  View All Analytics
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your account information
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how you receive notifications
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your API keys and webhooks
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleLogout}>
                  Log Out
                </Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
