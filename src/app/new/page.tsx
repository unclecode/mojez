// src/app/new/page.tsx
import { Suspense } from 'react';
import NewEntryContent from './NewEntryContent';

export default function NewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewEntryContent />
    </Suspense>
  );
}