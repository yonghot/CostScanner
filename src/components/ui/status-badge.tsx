'use client'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface StatusBadgeProps {
  isActive: boolean
  entityType?: 'ingredient' | 'recipe' | 'supplier'
  className?: string
}

const getTooltipText = (isActive: boolean, entityType: string = 'entity') => {
  const entityLabels = {
    ingredient: '식자재',
    recipe: '레시피', 
    supplier: '공급업체'
  }
  
  const entityLabel = entityLabels[entityType as keyof typeof entityLabels] || '항목'
  
  if (isActive) {
    return {
      title: '활성 상태',
      description: `현재 사용 중인 ${entityLabel}입니다. 가격 모니터링, 리포트 생성, 원가 계산 등에 포함됩니다.`
    }
  } else {
    return {
      title: '비활성 상태', 
      description: `일시적으로 사용하지 않는 ${entityLabel}입니다. 삭제하지 않고 보관하며, 필요시 다시 활성화할 수 있습니다.`
    }
  }
}

export default function StatusBadge({ isActive, entityType, className }: StatusBadgeProps) {
  const tooltipText = getTooltipText(isActive, entityType)
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={`cursor-help ${isActive ? "bg-success-light text-success-dark hover:bg-success/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"} ${className}`}
          >
            {isActive ? '활성' : '비활성'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-semibold">{tooltipText.title}</div>
            <div className="text-xs leading-relaxed">{tooltipText.description}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}