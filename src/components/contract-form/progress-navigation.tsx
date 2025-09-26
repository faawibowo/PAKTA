import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Users, 
  FileText, 
  Bot, 
  AlertCircle, 
  Settings, 
  Save,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SectionProgress } from '@/lib/form-progress-tracker';
import { cn } from '@/lib/utils';

interface ProgressNavigationProps {
  sections: SectionProgress[];
  currentSection: string;
  onSectionChange: (sectionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const iconMap = {
  Users,
  FileText,
  Bot,
  AlertCircle,
  Settings,
  Save
};

export function ProgressNavigation({
  sections,
  currentSection,
  onSectionChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}: ProgressNavigationProps) {
  const overallProgress = Math.round(
    sections.reduce((acc, section) => acc + section.completionPercentage, 0) / sections.length
  );

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Section Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 p-1">
        {sections.map((section) => {
          const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Bot;
          const isActive = currentSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-2 relative",
                isActive && "ring-2 ring-primary ring-offset-2",
                section.isComplete && !isActive && "bg-green-50 border-green-200 hover:bg-green-100"
              )}
            >
              <div className="flex items-center gap-1">
                <IconComponent className="h-3 w-3 shrink-0" />
                {section.isComplete && (
                  <Check className="h-3 w-3 text-green-600" />
                )}
              </div>
              <span className="text-[10px] truncate">{section.name}</span>
              <Badge 
                variant={section.isComplete ? "default" : "secondary"}
                className="text-xs px-1 py-0 h-4"
              >
                {section.completionPercentage}%
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {sections.findIndex(s => s.id === currentSection) + 1} of {sections.length}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}