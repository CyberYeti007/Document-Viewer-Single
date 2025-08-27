import {
  Home,
  Activity,
  BarChart3,
  AlertTriangle,
  Settings,
  FileText,
  Users,
  FolderOpen,
  Shield
} from "lucide-react"

export var menuPageItems = [
  {
    title: "Dashboard",
    icon: Home,
    start: "/dashboard",
    href: "/dashboard",
    role: ["user", "auditor", "admin", "moderator"],
  },
  {
    title: "Documents",
    icon: FileText,
    start: "/dashboard/documents",
    href: "/dashboard/documents",
    role: ["fileOwner"],
  },
  {
    title: "File Explorer",
    icon: FolderOpen,
    start: "/dashboard/files",
    href: "/dashboard/files/root",
    role: ["user", "auditor", "admin", "moderator"],
  },
  {
    title: "Approval Queue",
    icon: Activity,
    start: "/dashboard/approve",
    href: "/dashboard/approve",
    role: ["approver"],
  },
  {
    title: "Audit Trail",
    icon: BarChart3,
    start: "/dashboard/audit",
    href: "/dashboard/audit",
    role: ["auditor", "admin", "moderator"],
  },
  {
    title: "Reports",
    icon: AlertTriangle,
    start: "/dashboard/reports",
    href: "/dashboard/reports",
    role: ["admin", "moderator"],
  },
]

export var adminPageItems = [
  {
    title: "Administration",
    icon: Shield,
    start: "/dashboard/admin",
    href: "/dashboard/admin",
    role: ["admin", "moderator"],
  },
  {
    title: "Categories",
    icon: FolderOpen,
    start: "/dashboard/categories",
    href: "/dashboard/categories",
    role: ["admin", "moderator"],
  },
  {
    title: "Users & Roles",
    icon: Users,
    start: "/dashboard/users",
    href: "/dashboard/users",
    role: ["admin", "moderator"],
  },
  {
    title: "Compliance",
    icon: Shield,
    start: "/dashboard/compliance",
    href: "/dashboard/compliance",
    role: ["admin", "moderator"],
  },
  {
    title: "Settings",
    icon: Settings,
    start: "/dashboard/settings",
    href: "/dashboard/settings",
    role: ["moderator"],
  },
]