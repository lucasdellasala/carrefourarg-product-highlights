import React, { FC, ReactNode } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useHighlight } from './ProductHighlights'

interface Props {
  blockClass?: string
  children: ReactNode
}

const CSS_HANDLES = ['productHighlightWrapper'] as const

const ProductHighlightWrapper: FC<Props> = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const value = useHighlight()

  if (!value) {
    return null
  }

  //LOGICA DE PROMO
  const bestPromotion = () => {
    const discountHighlights = value.highlight[0].name
    const teasers = value.highlight[1].name
    const clusterHighlights = value.highlight[2].name

    const discountValue = (promotion: any): number => {
      if (promotion == undefined) {
        return 0
      }
      if (promotion[0] !== "PROMO") {
        return 0
      }
      const percentaje: any = promotion?.[4]
      const listOfNumbers: any = promotion?.[3]?.toString().split(",")
      const numberOfProducts: number = listOfNumbers?.length

      return numberOfProducts * percentaje
    }

    const teasersList = teasers.split("-") ?? ""
    const discountHighlightsList = discountHighlights.split("-") ?? ""
    const clusterHighlightsList = clusterHighlights.split("-") ?? ""

    const discountsList = [
      {
        value: discountValue(teasersList),
        list: teasersList
      },
      {
        value: discountValue(discountHighlightsList),
        list: discountHighlightsList
      },
      {
        value: discountValue(clusterHighlightsList),
        list: clusterHighlightsList
      }
    ]

    if (discountsList[0].value == discountsList[1].value && discountsList[0].value == discountsList[2].value) {
      return discountsList[0].list
    }

    const sortedDiscountsList = discountsList.sort((a, b) => b.value - a.value)

    if (sortedDiscountsList[0].value != 0) {
      return sortedDiscountsList[0].list
    } else {
      return null
    }
  }

  const bestValue = bestPromotion()
  const valueObject = {
    highlight: {
      name: bestValue?.[1],
      id: 101
    }
  }

  return (
    <div
      data-highlight-name={valueObject?.highlight?.name}
      data-highlight-id={valueObject?.highlight?.id}
      className={handles.productHighlightWrapper}
    >
      {children}
    </div>
  )
}

export default ProductHighlightWrapper
