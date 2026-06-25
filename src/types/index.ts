export interface AppWithCategory {
  id: string;
  slug: string;
  name: string;
  developer: string;
  description: string;
  shortDesc: string;
  version: string;
  packageName: string | null;
  platform: string;
  size: string | null;
  icon: string | null;
  screenshots: string;
  downloads: number;
  featured: boolean;
  status: string;
  downloadUrl: string | null;
  externalLink: string | null;
  tags: string;
  minOs: string | null;
  license: string;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  reviews?: ReviewWithUser[];
  files?: AppFile[];
  _count?: { reviews: number };
}

export interface ReviewWithUser {
  id: string;
  appId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface AppFile {
  id: string;
  appId: string;
  version: string;
  filename: string;
  filepath: string;
  filesize: string;
  platform: string;
  uploadedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  _count?: { apps: number };
}
