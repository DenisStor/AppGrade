import { useState } from 'react'

const TAB_VARIANTS = {
  underline: {
    container: 'border-b border-gray-200',
    tab: 'px-4 py-3 text-sm font-medium transition-colors relative',
    tabActive: 'text-gray-dark',
    tabInactive: 'text-gray-medium hover:text-gray-dark',
    indicator: 'absolute bottom-0 left-0 right-0 h-0.5 bg-gray-dark rounded-full',
  },
  pills: {
    container: 'bg-gray-100 p-1 rounded-lg inline-flex',
    tab: 'px-4 py-2 text-sm font-medium transition-all rounded-md',
    tabActive: 'bg-white text-gray-dark shadow-sm',
    tabInactive: 'text-gray-medium hover:text-gray-dark',
    indicator: '',
  },
}

export function Tabs({
  tabs = [],
  defaultTab,
  onChange,
  variant = 'underline',
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeTabData = tabs.find((t) => t.id === activeTab)
  const v = TAB_VARIANTS[variant]

  return (
    <div className={className}>
      <div className={v.container} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`${v.tab} ${isActive ? v.tabActive : v.tabInactive}`}
            >
              {tab.label}
              {isActive && v.indicator && <span className={v.indicator} />}
            </button>
          )
        })}
      </div>

      {activeTabData && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabData.id}`}
          aria-labelledby={activeTabData.id}
          className="pt-4"
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  )
}

export function TabList({ children, className = '' }) {
  return (
    <div className={`border-b border-gray-200 ${className}`} role="tablist">
      {children}
    </div>
  )
}

export function Tab({ isActive, onClick, children, className = '' }) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`
        px-4 py-3 text-sm font-medium transition-colors relative
        ${isActive ? 'text-gray-dark' : 'text-gray-medium hover:text-gray-dark'}
        ${className}
      `}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-dark rounded-full" />
      )}
    </button>
  )
}

export function TabPanel({ children, className = '' }) {
  return <div className={`pt-4 ${className}`}>{children}</div>
}
