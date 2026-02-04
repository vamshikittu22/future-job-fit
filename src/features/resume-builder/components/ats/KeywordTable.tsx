import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ArrowUpDown, Search } from 'lucide-react';
import { MatchResultModel, MatchStatus, KeywordCategory } from '@/shared/types/ats';
import { cn } from '@/shared/lib/utils';

interface KeywordTableProps {
    matchResults: MatchResultModel[];
    onKeywordClick?: (keyword: MatchResultModel) => void;
    className?: string;
}

type SortField = 'keyword' | 'category' | 'status' | 'scoreContribution';
type SortDirection = 'asc' | 'desc';

export const KeywordTable: React.FC<KeywordTableProps> = ({
    matchResults,
    onKeywordClick,
    className,
}) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<KeywordCategory | 'all'>('all');
    const [sortField, setSortField] = useState<SortField>('scoreContribution');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // Get status color
    const getStatusColor = (status: MatchStatus) => {
        switch (status) {
            case 'matched':
                return 'bg-green-500';
            case 'partial':
                return 'bg-yellow-500';
            case 'missing':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Get status badge variant
    const getStatusBadgeVariant = (status: MatchStatus) => {
        switch (status) {
            case 'matched':
                return 'default';
            case 'partial':
                return 'secondary';
            case 'missing':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // Get category label
    const getCategoryLabel = (category: KeywordCategory) => {
        const labels: Record<KeywordCategory, string> = {
            hard_skill: 'Hard Skill',
            tool: 'Tool',
            concept: 'Concept',
            soft_skill: 'Soft Skill',
        };
        return labels[category] || category;
    };

    // Toggle sort
    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Filter and sort data
    const filteredAndSorted = React.useMemo(() => {
        let data = [...matchResults];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(item =>
                item.keyword.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            data = data.filter(item => item.status === statusFilter);
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            data = data.filter(item => item.category === categoryFilter);
        }

        // Apply sorting
        data.sort((a, b) => {
            let aVal: string | number;
            let bVal: string | number;

            switch (sortField) {
                case 'keyword':
                    aVal = a.keyword.toLowerCase();
                    bVal = b.keyword.toLowerCase();
                    break;
                case 'category':
                    aVal = a.category;
                    bVal = b.category;
                    break;
                case 'status':
                    const statusOrder = { matched: 0, partial: 1, missing: 2 };
                    aVal = statusOrder[a.status];
                    bVal = statusOrder[b.status];
                    break;
                case 'scoreContribution':
                    aVal = a.scoreContribution;
                    bVal = b.scoreContribution;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return data;
    }, [matchResults, search, statusFilter, categoryFilter, sortField, sortDirection]);

    // Get unique categories from data
    const uniqueCategories = React.useMemo(() => {
        const categories = new Set(matchResults.map(item => item.category));
        return Array.from(categories);
    }, [matchResults]);

    if (matchResults.length === 0) {
        return (
            <div className={cn('text-center py-8 text-muted-foreground', className)}>
                No keyword data available. Add a job description to see matching results.
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search keywords..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MatchStatus | 'all')}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="matched">Matched</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as KeywordCategory | 'all')}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                                {getCategoryLabel(cat)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">
                                <Button variant="ghost" size="sm" onClick={() => toggleSort('keyword')} className="-ml-3">
                                    Keyword
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[120px]">
                                <Button variant="ghost" size="sm" onClick={() => toggleSort('category')} className="-ml-3">
                                    Category
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[100px]">
                                <Button variant="ghost" size="sm" onClick={() => toggleSort('status')} className="-ml-3">
                                    Status
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[80px] text-right">
                                <Button variant="ghost" size="sm" onClick={() => toggleSort('scoreContribution')} className="-ml-3">
                                    Score
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Location</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSorted.map((item, index) => (
                            <TableRow
                                key={`${item.keyword}-${index}`}
                                className={cn(
                                    onKeywordClick && 'cursor-pointer hover:bg-muted/50'
                                )}
                                onClick={() => onKeywordClick?.(item)}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className={cn('w-2 h-2 rounded-full', getStatusColor(item.status))} />
                                        {item.keyword}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                        {getCategoryLabel(item.category)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize">
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {item.scoreContribution.toFixed(1)}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                                    {item.locations.length > 0
                                        ? item.locations.join(', ')
                                        : '—'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                    Showing {filteredAndSorted.length} of {matchResults.length} keywords
                </span>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        {matchResults.filter(i => i.status === 'matched').length} matched
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        {matchResults.filter(i => i.status === 'partial').length} partial
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        {matchResults.filter(i => i.status === 'missing').length} missing
                    </span>
                </div>
            </div>
        </div>
    );
};
