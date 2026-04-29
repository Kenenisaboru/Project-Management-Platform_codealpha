'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Plus, MessageSquare, User, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'task_completed' | 'task_created' | 'comment_added' | 'project_created';
  user: string;
  action: string;
  target: string;
  time: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  { id: '1', type: 'task_completed', user: 'John Doe', action: 'completed task', target: 'Fix login bug', time: '2m ago' },
  { id: '2', type: 'comment_added', user: 'Jane Smith', action: 'commented on', target: 'Design review', time: '15m ago' },
  { id: '3', type: 'task_created', user: 'Mike Johnson', action: 'created task', target: 'Update documentation', time: '1h ago' },
  { id: '4', type: 'project_created', user: 'Sarah Wilson', action: 'created project', target: 'Mobile App v2', time: '3h ago' },
];

const icons = {
  task_completed: CheckCircle,
  task_created: Plus,
  comment_added: MessageSquare,
  project_created: User,
};

const colors = {
  task_completed: 'text-emerald-400 bg-emerald-500/20',
  task_created: 'text-indigo-400 bg-indigo-500/20',
  comment_added: 'text-blue-400 bg-blue-500/20',
  project_created: 'text-purple-400 bg-purple-500/20',
};

export default function ActivityFeed({ activities = defaultActivities }: ActivityFeedProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 font-outfit text-lg font-semibold text-white">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = icons[activity.type];
          const color = colors[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className={`mt-1 rounded-lg p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                  <span className="font-medium text-indigo-400">{activity.target}</span>
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
