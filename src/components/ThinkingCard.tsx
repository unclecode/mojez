// components/ThinkingCard.tsx
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ThinkingCardProps {
  thinking: string
}

export function ThinkingCard({ thinking }: ThinkingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thinking Process</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={isExpanded ? '' : 'line-clamp-3'}>{thinking}</p>
        {thinking.length > 150 && (
          <Button 
            variant="link" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}