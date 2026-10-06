'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, FunilStatus, LeadList } from '@/types'

interface LeadStore {
  savedLeads: Lead[]
  lists: LeadList[]
  selectedListId: string | null

  saveLead: (lead: Lead) => void
  removeSavedLead: (id: string) => void
  isLeadSaved: (id: string) => boolean
  updateLeadFunil: (id: string, status: FunilStatus) => void
  updateLeadAiDescription: (id: string, description: string, approach_angle: string) => void
  addList: (name: string, color?: string) => void
  removeList: (id: string) => void
  addLeadToList: (leadId: string, listId: string) => void
  setSelectedList: (id: string | null) => void
  getLeadsByList: (listId: string) => Lead[]
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      savedLeads: [],
      lists: [
        {
          id: 'default',
          name: 'Meus Leads',
          color: '#007AFF',
          icon: 'users',
          count: 0,
          created_at: new Date().toISOString(),
        },
      ],
      selectedListId: null,

      saveLead: (lead) =>
        set((s) => ({
          savedLeads: s.savedLeads.some((l) => l.id === lead.id)
            ? s.savedLeads
            : [...s.savedLeads, lead],
        })),
      removeSavedLead: (id) =>
        set((s) => ({
          savedLeads: s.savedLeads.filter((l) => l.id !== id),
        })),
      isLeadSaved: (id) => get().savedLeads.some((l) => l.id === id),
      updateLeadFunil: (id, status) =>
        set((s) => ({
          savedLeads: s.savedLeads.map((l) =>
            l.id === id
              ? { ...l, funil_status: status, updated_at: new Date().toISOString() }
              : l
          ),
        })),
      updateLeadAiDescription: (id, description, approach_angle) =>
        set((s) => ({
          savedLeads: s.savedLeads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  ai_description: description,
                  ai_approach_angle: approach_angle,
                  ai_generated_at: new Date().toISOString(),
                }
              : l
          ),
        })),
      addList: (name, color) =>
        set((s) => ({
          lists: [
            ...s.lists,
            {
              id: Date.now().toString(),
              name,
              color: color || '#007AFF',
              count: 0,
              created_at: new Date().toISOString(),
            },
          ],
        })),
      removeList: (id) =>
        set((s) => ({
          lists: s.lists.filter((l) => l.id !== id),
        })),
      addLeadToList: (leadId, listId) =>
        set((s) => ({
          savedLeads: s.savedLeads.map((l) =>
            l.id === leadId ? { ...l, list_id: listId } : l
          ),
        })),
      setSelectedList: (id) => set({ selectedListId: id }),
      getLeadsByList: (listId) =>
        get().savedLeads.filter((l) => l.list_id === listId),
    }),
    { name: 'leadmap-leads' }
  )
)
