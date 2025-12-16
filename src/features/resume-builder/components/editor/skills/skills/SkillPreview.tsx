import { SkillCategoryType } from "@/shared/types/resume";

export const SkillPreview = ({ categories }: { categories: SkillCategoryType[] }) => (
    <div className="space-y-3">
        {categories.map((category) => (
            <div key={category.id} className="mb-3">
                <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="text-sm font-semibold text-foreground leading-7">
                        {category.name}:
                    </h4>
                    <div className="flex flex-wrap gap-1.5 items-center">
                        {category.items.length > 0 ? (
                            category.items.map((skill, index) => (
                                <span
                                    key={`${category.id}-${index}`}
                                    className="text-sm font-normal text-foreground/90"
                                >
                                    {skill}
                                    {index < category.items.length - 1 ? ',' : ''}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground italic">
                                No skills added
                            </span>
                        )}
                    </div>
                </div>
            </div>
        ))}
    </div>
);
