import React from 'react';
import { Progress } from '@/shared/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { FileText, Briefcase, GraduationCap, Lightbulb, FolderKanban, Award, BookOpen } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SectionCoverage {
    covered: number;
    total: number;
    percentage: number;
}

interface SectionCoverageMapProps {
    getCoverageBySection: (section: string) => SectionCoverage;
    className?: string;
}

// Section metadata
const SECTION_CONFIG = [
    {
        id: 'summary',
        label: 'Summary',
        icon: FileText,
        description: 'Professional overview'
    },
    {
        id: 'experience',
        label: 'Experience',
        icon: Briefcase,
        description: 'Work history and achievements'
    },
    {
        id: 'skills',
        label: 'Skills',
        icon: Lightbulb,
        description: 'Technical and soft skills'
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: FolderKanban,
        description: 'Notable projects'
    },
    {
        id: 'education',
        label: 'Education',
        icon: GraduationCap,
        description: 'Degrees and certifications'
    },
    {
        id: 'certifications',
        label: 'Certifications',
        icon: Award,
        description: 'Professional certifications'
    },
    {
        id: 'achievements',
        label: 'Achievements',
        icon: BookOpen,
        description: 'Awards and recognition'
    },
];

// Get color based on coverage percentage
const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
};

const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
};

export const SectionCoverageMap: React.FC<SectionCoverageMapProps> = ({
    getCoverageBySection,
    className,
}) => {
    // Calculate coverage for all sections
    const sectionData = SECTION_CONFIG.map(section => ({
        ...section,
        coverage: getCoverageBySection(section.id),
    }));

    // Calculate overall coverage
    const totalCovered = sectionData.reduce((sum, s) => sum + s.coverage.covered, 0);
    const totalKeywords = sectionData.reduce((sum, s) => sum + s.coverage.total, 0);
    const overallPercentage = totalKeywords > 0
        ? Math.round((totalCovered / totalKeywords) * 100)
        : 0;

    // Filter to only show sections with keywords
    const activeSections = sectionData.filter(s => s.coverage.total > 0);

    if (activeSections.length === 0) {
        return (
            <div className={cn('text-center py-8 text-muted-foreground', className)}>
                No section coverage data available. Add a job description to see keyword distribution.
            </div>
        );
    }

    return (
        <div className={cn('space-y-6', className)}>
            {/* Overall Coverage */}
            <Card className="border-primary/20">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Overall Keyword Coverage</CardTitle>
                        <Badge variant={overallPercentage >= 70 ? 'default' : 'secondary'}>
                            {totalCovered} of {totalKeywords} keywords
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress
                            value={overallPercentage}
                            className="flex-1 h-3"
                        />
                        <span className={cn('text-2xl font-bold min-w-[60px] text-right', getCoverageColor(overallPercentage))}>
                            {overallPercentage}%
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Section Breakdown */}
            <div className="grid gap-3">
                {activeSections.map(section => {
                    const { coverage, icon: Icon } = section;
                    const hasGoodCoverage = coverage.percentage >= 70;

                    return (
                        <div
                            key={section.id}
                            className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                        >
                            <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center',
                                hasGoodCoverage ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">{section.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {coverage.covered} / {coverage.total} keywords
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn('h-full rounded-full transition-all', getProgressColor(coverage.percentage))}
                                            style={{ width: `${coverage.percentage}%` }}
                                        />
                                    </div>
                                    <span className={cn('text-sm font-semibold min-w-[40px] text-right', getCoverageColor(coverage.percentage))}>
                                        {coverage.percentage}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>≥80% Great</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>50-79% Needs work</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>&lt;50% Critical</span>
                </div>
            </div>
        </div>
    );
};
