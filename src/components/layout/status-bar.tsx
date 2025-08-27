import { Progress } from "../ui/progress";

interface StatusBarProps {
    progress: number;
    title: string;
    subtitle?: string;
    color: string; // 
}
export function StatusBar({ progress, title, subtitle, color }: StatusBarProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-sm text-muted-foreground">{subtitle}</span>
            </div>
            <Progress value={progress} className='h-2' indicatorColor={color}/>
        </div>
)}