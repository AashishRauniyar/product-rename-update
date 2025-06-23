// src/components/Footer.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/healthpaysecure.png"
                alt="HealthPaySecure"
                width={300}
                height={300}
                unoptimized
              />
            </Link>
            <p className="text-gray-400 mb-6 pr-8">
              HealthPaySecure is the leading healthcare payment platform that
              connects providers, patients, and payers in one secure ecosystem.
              Our HIPAA-compliant solution streamlines the entire payment
              process.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                className="bg-gray-800 hover:bg-blue-400 p-2 rounded-full transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="bg-gray-800 hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/solutions/providers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  For Healthcare Providers
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/patients"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  For Patients
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/insurance"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  For Insurance Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/billing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Medical Billing Services
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/integration"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  EHR Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <span>
                  123 Healthcare Ave, Suite 500
                  <br />
                  Miami, FL 33101
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <a
                  href="tel:+18005551234"
                  className="hover:text-white transition-colors"
                >
                  1-800-555-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <a
                  href="mailto:info@healthpaysecure.us"
                  className="hover:text-white transition-colors"
                >
                  info@healthpaysecure.us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Badges Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">256-bit Encryption</span>
              </div>
              <div className="flex items-center">
                <Image
                  src="/images/HeatlyhPay.jpg"
                  alt="PCI Compliant"
                  width={50}
                  height={20}
                  className="mr-2 bg-transparent"
                />
                <span className="text-sm">PCI DSS Certified</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} HealthPaySecure. All rights reserved.
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-6 text-sm text-gray-500 flex flex-wrap gap-6 justify-center md:justify-end">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/security" className="hover:text-white transition-colors">
            Security
          </Link>
          <Link
            href="/accessibility"
            className="hover:text-white transition-colors"
          >
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
