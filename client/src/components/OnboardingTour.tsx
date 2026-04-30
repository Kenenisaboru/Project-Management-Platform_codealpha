'use client';

import { Joyride, Step, CallBackProps, STATUS } from 'react-joyride';
import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface TourStep extends Step {
  target: string;
  content: string;
  title?: string;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: Record<string, TourStep[]> = {
  '/dashboard': [
    {
      target: '.tour-search-bar',
      content: 'Use the search bar to quickly find projects and tasks. Press Ctrl+K to open it anytime.',
      title: 'Quick Search',
      placement: 'bottom',
    },
    {
      target: '.tour-stats',
      content: 'View your project statistics and key metrics at a glance.',
      title: 'Dashboard Stats',
      placement: 'bottom',
    },
    {
      target: '.tour-projects',
      content: 'Access all your projects from here. Click on any project to view details.',
      title: 'Your Projects',
      placement: 'right',
    },
    {
      target: '.tour-quick-actions',
      content: 'Quickly create new projects, tasks, or invite team members.',
      title: 'Quick Actions',
      placement: 'left',
    },
    {
      target: '.tour-activity-feed',
      content: 'Stay updated with recent activities and team notifications.',
      title: 'Activity Feed',
      placement: 'left',
    },
  ],
  '/projects': [
    {
      target: '.tour-kanban-board',
      content: 'This is your Kanban board. Drag and drop tasks between columns to update their status.',
      title: 'Kanban Board',
      placement: 'bottom',
    },
    {
      target: '.tour-task-filters',
      content: 'Filter tasks by priority to focus on what matters most.',
      title: 'Task Filters',
      placement: 'bottom',
    },
    {
      target: '.tour-task-card',
      content: 'Click on any task card to view details, add comments, or update status.',
      title: 'Task Cards',
      placement: 'bottom',
    },
  ],
  '/settings': [
    {
      target: '.tour-profile-settings',
      content: 'Update your personal information and preferences here.',
      title: 'Profile Settings',
      placement: 'right',
    },
    {
      target: '.tour-workspace-settings',
      content: 'Manage your workspace details, billing, and team settings.',
      title: 'Workspace Settings',
      placement: 'left',
    },
  ],
};

export default function OnboardingTour() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const pathname = usePathname();

  const currentSteps = TOUR_STEPS[pathname] || [];

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      setStepIndex(0);
      // Save tour completion to localStorage
      localStorage.setItem(`tour-completed-${pathname}`, 'true');
    }

    if (type === 'step:before') {
      // Add custom animations or actions before each step
      const element = document.querySelector(currentSteps[stepIndex]?.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSteps, stepIndex]);

  const startTour = useCallback(() => {
    setRun(true);
    setStepIndex(0);
  }, []);

  const skipTour = useCallback(() => {
    setRun(false);
    setStepIndex(0);
    localStorage.setItem(`tour-completed-${pathname}`, 'true');
  }, []);

  // Check if tour should run for first-time users
  const shouldRunTour = !localStorage.getItem(`tour-completed-${pathname}`) && currentSteps.length > 0;

  // Expose tour controls globally
  if (typeof window !== 'undefined') {
    (window as any).startTour = startTour;
    (window as any).skipTour = skipTour;
  }

  return (
    <>
      <Joyride
        steps={currentSteps}
        run={run || shouldRunTour}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        stepIndex={stepIndex}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#1f2937',
            primaryColor: '#6366f1',
            textColor: '#fff',
            zIndex: 1000,
          },
          buttonNext: {
            backgroundColor: '#6366f1',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '0.5rem 1rem',
          },
          buttonBack: {
            color: '#9ca3af',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '0.5rem 1rem',
          },
          buttonSkip: {
            color: '#9ca3af',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '0.5rem 1rem',
          },
          tooltip: {
            borderRadius: '0.75rem',
            padding: '1rem',
            maxWidth: '320px',
          },
          tooltipTitle: {
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
          },
          tooltipContent: {
            fontSize: '0.875rem',
            lineHeight: '1.5',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          spotlight: {
            borderRadius: '0.5rem',
          },
        }}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip Tour',
        }}
      />
      
      {/* Tour Trigger Button (for development/testing) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={startTour}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-indigo-500 p-3 text-white shadow-lg hover:bg-indigo-600 transition-colors"
          title="Start Tour"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}
    </>
  );
}
