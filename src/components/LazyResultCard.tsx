// components/LazyResultCard.tsx
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const ResultCard = dynamic(() => import('./ResultCard'), {
  loading: () => <Skeleton className="w-full h-40" />,
  ssr: false
})

export default ResultCard