export interface ProductData {
  id: string;
  old_name: string;
  new_name: string;
  description: string;
  description_points: string[];
  rename_reason: string;
  old_images: string[];
  new_images: string[];
  badge_image_url: string | null;
  extra_badge_1: string | null;
  extra_badge_2: string | null;
  next_redirect_url: string;
  redirect_timer: number;
  theme: string;
  generated_link: string;
  page_title: string;
  category_name: string | null;
  category_id: string | null;
  domain: string | null;
  total_clicks: number;
} 