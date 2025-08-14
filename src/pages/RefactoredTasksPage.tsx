import React, { useState } from 'react';
import { FollowUpList, FollowUpItem } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RefactoredTasksPageProps {
  tasks: FollowUpItem[];
  onOpenTask: (task: FollowUpItem) => void;
  onMarkComplete: (taskId: number) => void;
  onToggleTask: (taskId: number, checked: boolean) => void;
  className?: string;
}

export const RefactoredTasksPage = ({
  tasks,
  onOpenTask,
  onMarkComplete,
  onToggleTask,
  className
}: RefactoredTasksPageProps) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

  const filteredTasks = tasks.map(task => ({
    ...task,
    isChecked: checkedTasks.has(task.id)
  })).filter(task => {
    switch (filter) {
      case 'active': return !task.isChecked;
      case 'completed': return task.isChecked;
      default: return true;
    }
  });

  const handleToggleTask = (taskId: number, checked: boolean) => {
    const newCheckedTasks = new Set(checkedTasks);
    if (checked) {
      newCheckedTasks.add(taskId);
    } else {
      newCheckedTasks.delete(taskId);
    }
    setCheckedTasks(newCheckedTasks);
    onToggleTask(taskId, checked);
  };

  const taskStats = {
    total: tasks.length,
    completed: checkedTasks.size,
    active: tasks.length - checkedTasks.size
  };

  return (
    <div className={className}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Tasks & Follow-ups</h1>
          
          <div className="flex items-center gap-2">
            <Badge variant="low" className="text-xs">
              {taskStats.total} Total
            </Badge>
            <Badge variant="medium" className="text-xs">
              {taskStats.active} Active
            </Badge>
            <Badge variant="high" className="text-xs">
              {taskStats.completed} Completed
            </Badge>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({taskStats.total})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active ({taskStats.active})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed ({taskStats.completed})
          </Button>
        </div>

        {/* Tasks list */}
        <FollowUpList
          items={filteredTasks}
          onOpenItem={onOpenTask}
          onToggleItem={handleToggleTask}
          onMarkComplete={onMarkComplete}
          showCheckboxes={true}
        />
      </div>
    </div>
  );
};