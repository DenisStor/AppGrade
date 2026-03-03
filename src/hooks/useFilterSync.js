import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRICE } from '../data/constants'

/**
 * Хук для синхронизации фильтров с URL
 * @param {Object} initialFilters - начальное состояние фильтров
 * @param {Function} parseUrl - функция парсинга URL → filters
 * @param {Function} buildUrl - функция построения filters → URL params
 */
export function useFilterSync(initialFilters, parseUrl, buildUrl) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('popular')
  const isFirstRender = useRef(true)

  // URL → State (при загрузке)
  useEffect(() => {
    const parsed = parseUrl(searchParams)
    setFilters(parsed.filters)
    setSortBy(parsed.sortBy || 'popular')
    isFirstRender.current = false
  }, []) // eslint-disable-line

  // State → URL (при изменении)
  useEffect(() => {
    if (isFirstRender.current) return

    const params = buildUrl(filters, sortBy)
    setSearchParams(params, { replace: true })
  }, [filters, sortBy, buildUrl, setSearchParams])

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  return { filters, sortBy, setSortBy, setFilter, resetFilters }
}

// Хелперы для парсинга URL

export const parseArray = (value) => value?.split(',').filter(Boolean) || []
export const parseNumberArray = (value) => value?.split(',').map(Number).filter(Boolean) || []
export const parseBoolean = (value) => value === 'true'
export const parseNumber = (value, fallback = 0) => Number(value) || fallback

/**
 * Парсер URL для BrandPage
 */
export function parseBrandPageUrl(searchParams) {
  return {
    filters: {
      series: parseArray(searchParams.get('series')),
      colors: parseArray(searchParams.get('colors')),
      memory: parseNumberArray(searchParams.get('memory')),
      brands: [], // Бренд определяется URL-путём, фильтр всегда пустой
      priceRange: [
        parseNumber(searchParams.get('priceMin'), 0),
        parseNumber(searchParams.get('priceMax'), PRICE.MAX),
      ],
      inStock: parseBoolean(searchParams.get('inStock')),
    },
    sortBy: searchParams.get('sort') || 'popular',
  }
}

/**
 * Построитель URL для BrandPage
 */
export function buildBrandPageUrl(filters, sortBy) {
  const params = new URLSearchParams()

  if (filters.series.length) params.set('series', filters.series.join(','))
  if (filters.colors.length) params.set('colors', filters.colors.join(','))
  if (filters.memory.length) params.set('memory', filters.memory.join(','))
  if (filters.priceRange[0] > 0) params.set('priceMin', filters.priceRange[0])
  if (filters.priceRange[1] < PRICE.MAX) params.set('priceMax', filters.priceRange[1])
  if (filters.inStock) params.set('inStock', 'true')
  if (sortBy !== 'popular') params.set('sort', sortBy)

  return params
}

/**
 * Парсер URL для UsedPage
 */
export function parseUsedPageUrl(searchParams) {
  return {
    filters: {
      categories: parseArray(searchParams.get('categories')),
      conditions: parseArray(searchParams.get('conditions')),
      priceRange: [
        parseNumber(searchParams.get('priceMin'), 0),
        parseNumber(searchParams.get('priceMax'), PRICE.MAX),
      ],
      inStock: parseBoolean(searchParams.get('inStock')),
    },
    sortBy: searchParams.get('sort') || 'popular',
  }
}

/**
 * Построитель URL для UsedPage
 */
export function buildUsedPageUrl(filters, sortBy) {
  const params = new URLSearchParams()

  if (filters.categories.length) params.set('categories', filters.categories.join(','))
  if (filters.conditions.length) params.set('conditions', filters.conditions.join(','))
  if (filters.priceRange[0] > 0) params.set('priceMin', filters.priceRange[0])
  if (filters.priceRange[1] < PRICE.MAX) params.set('priceMax', filters.priceRange[1])
  if (filters.inStock) params.set('inStock', 'true')
  if (sortBy !== 'popular') params.set('sort', sortBy)

  return params
}

// Начальные состояния фильтров

export const BRAND_PAGE_INITIAL_FILTERS = {
  series: [],
  colors: [],
  memory: [],
  brands: [],
  priceRange: [0, PRICE.MAX],
  inStock: false,
}

export const USED_PAGE_INITIAL_FILTERS = {
  categories: [],
  conditions: [],
  priceRange: [0, PRICE.MAX],
  inStock: false,
}
