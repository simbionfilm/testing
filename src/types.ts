export interface WorkItem {
  id?: string;
  title: string;
  artist: string;
  year: string;
  videoId: string;
  row: 1 | 2 | 3;
}

export interface RecentRelease {
  title: string;
  videoId: string;
  link: string;
}

export interface CMSData {
  recentRelease: RecentRelease;
  works: WorkItem[];
}
