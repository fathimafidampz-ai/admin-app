
'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { SingleQuestionForm } from '@/components/questions/SingleQuestionForm';

export default function QuestionsPage() {
  return (
    <AppLayout 
      title="Upload Questions" 
      subtitle="Add bank questions with images and 3PL parameters"
    >
      <div className="max-w-5xl mx-auto">
        <SingleQuestionForm />
      </div>
    </AppLayout>
  );
}