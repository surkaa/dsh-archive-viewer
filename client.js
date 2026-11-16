/**
 * Browser half of the archived-session visibility bundle.
 *
 * The sidebar's archived filter is browser-local view state owned by the
 * shipped ui-workspace plugin. That plugin exposes no setter, but its
 * `sidebar.workspaces` registration carries the live view store handle, so
 * this plugin finds that entry through the slot registry and writes through
 * the same actions the sidebar's own View options menu uses. The switch is
 * therefore live and persists with the ordinary workspace view preference.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-archive-viewer',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'archiveViewer'
    /** Slot whose registration owns the live workspace-view store. */
    const WORKSPACE_SLOT = 'sidebar.workspaces'
    /** General-section seat for one preference row. */
    const SETTINGS_SLOT = 'settings.general.item'

    const en = {
      title: 'Show archived sessions',
      description: 'Show archived sessions in the sidebar workspace list. Off matches View options → Hide archived, which also turns off the sidebar’s “filter archived sessions” action; on matches All conversations (show archived).',
      'status.show': 'Shown in the sidebar',
      'status.hidden': 'Hidden in the sidebar',
      'status.only': 'Archived sessions only',
      'count.one': '1 archived session',
      'count.other': '{n} archived sessions',
      empty: 'No archived sessions',
      error: 'Could not change the filter. Try again.',
      unavailable: 'The sidebar workspace list is unavailable, so this filter cannot be changed right now.',
    }

    const zh = {
      title: '显示已归档会话',
      description: '在侧栏工作区列表中显示已归档会话。关闭后等同于视图选项的“隐藏已归档”，即关闭侧栏的“筛选已归档会话”；开启后等同于“全部对话（显示已归档）”。',
      'status.show': '侧栏显示已归档会话',
      'status.hidden': '侧栏隐藏已归档会话',
      'status.only': '侧栏仅显示已归档会话',
      'count.one': '共 1 个已归档会话',
      'count.other': '共 {n} 个已归档会话',
      empty: '暂无已归档会话',
      error: '无法更改筛选，请重试。',
      unavailable: '侧栏工作区列表不可用，暂时无法更改此筛选。',
    }

    /* Row chrome follows the shipped General-section rows; the switch copies
     * the host Switch's geometry and theme-token bindings under this plugin's
     * own class names. */
    const CSS = [
      '.dsh-av-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px 0;border-bottom:0.5px solid var(--dsw-alias-border-l2);}',
      '.dsh-av-copy{min-width:0;}',
      '.dsh-av-title{font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary);}',
      '.dsh-av-description{margin-top:4px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;}',
      '.dsh-av-meta{margin-top:4px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;}',
      '.dsh-av-error{margin-top:4px;color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px;}',
      '.dsh-av-switch{box-sizing:border-box;position:relative;flex:0 0 auto;width:36px;height:20px;padding:2px;border:0;border-radius:999px;corner-shape:round;background:var(--dsw-alias-border-l3);cursor:pointer;}',
      '.dsh-av-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary);}',
      '.dsh-av-switch:disabled{cursor:default;opacity:.5;}',
      '.dsh-av-switch:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px;}',
      '.dsh-av-thumb{display:block;width:16px;height:16px;border-radius:50%;corner-shape:round;background:var(--dsw-alias-label-primary-foreground);transition:transform .12s ease;}',
      '.dsh-av-switch[aria-checked="false"] .dsh-av-thumb{background:var(--dsw-alias-switch-thumb);}',
      '.dsh-av-switch[aria-checked="true"] .dsh-av-thumb{transform:translate(16px);}',
    ].join('')

    /** Read the three-way archived filter from a workspace-view store instance. */
    function readFilter(instance) {
      try {
        const snapshot = instance.getSnapshot()
        const filter = snapshot && snapshot.archivedFilter
        return filter === 'show' || filter === 'only' ? filter : 'default'
      } catch {
        return 'default'
      }
    }

    /** A slot registration that carries a store handle rather than a store factory. */
    function isStoreHandle(entry) {
      return entry !== undefined
        && entry !== null
        && entry.store !== undefined
        && typeof entry.store !== 'function'
        && typeof entry.store.create === 'function'
    }

    function ArchiveVisibilityRow({ useArchiveState, setShowArchived, useWorkspaces, t }) {
      const state = useArchiveState(value => value)
      const archivedCount = useWorkspaces(value => value.archivedSessionIds.length)
      const [failed, setFailed] = React.useState(false)
      const showArchived = state.filter !== 'default'
      const status = state.filter === 'only'
        ? t('status.only')
        : state.filter === 'show' ? t('status.show') : t('status.hidden')
      const count = archivedCount === 0
        ? t('empty')
        : archivedCount === 1 ? t('count.one') : t('count.other', { n: archivedCount })
      const meta = state.available ? `${status} · ${count}` : t('unavailable')
      return h(
        React.Fragment,
        null,
        h('style', null, CSS),
        h(
          'div',
          { className: 'dsh-av-row' },
          h(
            'div',
            { className: 'dsh-av-copy' },
            h('div', { className: 'dsh-av-title' }, t('title')),
            h('div', { className: 'dsh-av-description', id: 'dsh-av-description' }, t('description')),
            h('div', { className: 'dsh-av-meta', id: 'dsh-av-meta' }, meta),
            failed && h('div', { className: 'dsh-av-error', role: 'alert' }, t('error')),
          ),
          h(
            'button',
            {
              type: 'button',
              role: 'switch',
              'aria-checked': showArchived,
              'aria-label': t('title'),
              'aria-describedby': 'dsh-av-description dsh-av-meta',
              disabled: !state.available,
              className: 'dsh-av-switch',
              onClick: () => {
                setFailed(false)
                if (setShowArchived(!showArchived) === false) setFailed(true)
              },
            },
            h('span', { className: 'dsh-av-thumb' }),
          ),
        ),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        let binding
        let rejectedEntry
        let state = { filter: 'default', available: false }
        const listeners = new Set()

        const publish = (next) => {
          if (next.filter === state.filter && next.available === state.available) return
          state = { filter: next.filter, available: next.available }
          for (const listener of [...listeners]) {
            try {
              listener()
            } catch (error) {
              console.warn('archive visibility: state listener failed:', error)
            }
          }
        }

        const source = {
          getSnapshot: () => state,
          subscribe: (listener) => {
            listeners.add(listener)
            return () => { listeners.delete(listener) }
          },
        }

        const unbind = () => {
          if (binding === undefined) return
          const { unsubscribe } = binding
          binding = undefined
          try {
            unsubscribe()
          } catch (error) {
            console.warn('archive visibility: store unsubscribe failed:', error)
          }
          publish({ filter: 'default', available: false })
        }

        const reconcile = () => {
          let entries
          try {
            entries = ctx.slots.entries(WORKSPACE_SLOT)
          } catch (error) {
            console.warn('archive visibility: slot lookup failed:', error)
            return
          }
          // Prefer the registration whose store persists the workspace view; a
          // fallback keeps the row usable if a future release drops `spec`.
          const entry = entries.find(candidate => isStoreHandle(candidate)
              && typeof candidate.store.spec?.persist === 'string'
              && candidate.store.spec.persist.startsWith('dsh.workspace.view'))
            ?? entries.find(isStoreHandle)
          if (entry === undefined) {
            unbind()
            return
          }
          if (entry === rejectedEntry) return
          if (binding !== undefined && binding.entry === entry) return
          unbind()

          // ui-workspace overrides the handle's create() to return the one live
          // instance the sidebar renders. A handle that returns a fresh store per
          // call would leave the switch writing to a detached copy, so treat that
          // shape as unavailable instead of pretending it works.
          let instance
          let probe
          try {
            instance = entry.store.create()
            probe = entry.store.create()
          } catch (error) {
            console.warn('archive visibility: workspace view store unavailable:', error)
            return
          }
          if (instance !== probe) {
            rejectedEntry = entry
            console.warn('archive visibility: the sidebar view store no longer exposes its live instance; this plugin needs an update')
            publish({ filter: 'default', available: false })
            return
          }
          if (instance === undefined
            || typeof instance.getSnapshot !== 'function'
            || typeof instance.subscribe !== 'function'
            || instance.actions === undefined
            || typeof instance.actions.setArchivedFilter !== 'function') return

          const sync = () => { publish({ filter: readFilter(instance), available: true }) }
          let unsubscribe = () => {}
          try {
            unsubscribe = instance.subscribe(sync) ?? (() => {})
          } catch (error) {
            console.warn('archive visibility: store subscribe failed:', error)
          }
          binding = { entry, instance, unsubscribe }
          sync()
        }

        const setShowArchived = (show) => {
          if (binding === undefined) return false
          try {
            binding.instance.actions.setArchivedFilter(show ? 'show' : 'default')
            return true
          } catch (error) {
            console.warn('archive visibility: filter update failed:', error)
            return false
          }
        }

        ctx.effect(() => {
          const off = ctx.slots.subscribe(WORKSPACE_SLOT, reconcile)
          reconcile()
          return () => { off(); unbind() }
        }, 'archive-visibility: bind the workspace view store')

        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'archive-visibility: dictionaries')

        ctx.slots.inject(SETTINGS_SLOT, () => ctx.slots.register({
          name: SETTINGS_SLOT,
          id: 'archive-visibility',
          order: 13,
          locale: NS,
          inject: () => ({
            hooks: { archiveState: source },
            setShowArchived,
          }),
        }, ArchiveVisibilityRow))
      },
    }
  },
})