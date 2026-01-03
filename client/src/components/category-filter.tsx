import { GraduationCap, Palette, Trophy, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Category = "all" | "academico" | "cultural" | "deportivo";

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

const categories = [
  { id: "all" as const, label: "Todos", icon: LayoutGrid },
  { id: "academico" as const, label: "Académico", icon: GraduationCap },
  { id: "cultural" as const, label: "Cultural", icon: Palette },
  { id: "deportivo" as const, label: "Deportivo", icon: Trophy },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 p-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selected === category.id;
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className="rounded-full gap-2 flex-shrink-0"
              onClick={() => onSelect(category.id)}
              data-testid={`button-category-${category.id}`}
            >
              <Icon className="h-4 w-4" />
              <span>{category.label}</span>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export type { Category };
