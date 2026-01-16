import React from 'react';
import { Button } from '@/shared/ui/button';
import {
    Plus,
    Users,
    TrendingDown,
    Settings,
    Zap,
    DollarSign,
    ChevronDown,
    Layout
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface AchievementTemplate {
    id: string;
    name: string;
    template: string;
    icon: React.ElementType;
    titleSuggestion: string;
}

const TEMPLATES: AchievementTemplate[] = [
    {
        id: 'team-leadership',
        name: 'Team Leadership',
        template: 'Led a team of [number] members to [action] resulting in [result].',
        icon: Users,
        titleSuggestion: 'Team Leadership'
    },
    {
        id: 'process-improvement',
        name: 'Process / Cost Reduction',
        template: 'Reduced [process/cost] by [percentage]% by implementing [method/solution].',
        icon: TrendingDown,
        titleSuggestion: 'Process Optimization'
    },
    {
        id: 'technical-implementation',
        name: 'Technical Implementation',
        template: 'Implemented [technology] which improved [process] and resulted in [benefit].',
        icon: Settings,
        titleSuggestion: 'Technical Innovation'
    },
    {
        id: 'efficiency-gain',
        name: 'Efficiency & Speed',
        template: 'Increased operational efficiency by [percentage]% through [action].',
        icon: Zap,
        titleSuggestion: 'Efficiency Excellence'
    },
    {
        id: 'budget-management',
        name: 'Budget & Finance',
        template: 'Managed a budget of $[amount] and successfully [result/saved amount].',
        icon: DollarSign,
        titleSuggestion: 'Budget Oversight'
    }
];

interface AchievementTemplateSelectorProps {
    onSelect: (template: string, title?: string) => void;
}

export const AchievementTemplateSelector: React.FC<AchievementTemplateSelectorProps> = ({ onSelect }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2 border-dashed border-primary/40 hover:border-primary/60 hover:bg-primary/5 transition-all text-xs">
                    <Layout className="w-3.5 h-3.5 text-primary" />
                    Use Template
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <TrophyIcon className="w-4 h-4 text-amber-500" />
                    Achievement Templates
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TEMPLATES.map((t) => (
                    <DropdownMenuItem
                        key={t.id}
                        onClick={() => onSelect(t.template, t.titleSuggestion)}
                        className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <t.icon className="w-4 h-4 text-primary" />
                            {t.name}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                            {t.template}
                        </p>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// Simple icon wrapper to avoid importing Lucide Trophy just for the label
const TrophyIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);
