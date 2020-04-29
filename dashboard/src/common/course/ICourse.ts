export interface ICourse {
    id: number | null;
    timestamp: Date | null;
    name: string | null;
    description: string | null;
    category: number | string | null;
    videoUrl: string | null;
    save(): Promise<void>;
    delete(): Promise<void>;
    populate(): Promise<void>;
}