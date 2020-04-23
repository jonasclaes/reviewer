export interface ICourse {
    id: number | null;
    timestamp: Date | null;
    name: string | null;
    description: string | null;
    category: number | null;
    videoUrl: string | null;
    save(): Promise<void>;
}