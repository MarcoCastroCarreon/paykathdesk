import { ReactElement } from "react"

export type ViewStructure = {
    content: Function | ReactElement,
    key: ViewKeys,
    icon: Function | ReactElement,
    label: string
}

export type ViewKeys = 'budgets' | 'expenses'