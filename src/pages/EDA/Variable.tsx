import { Plot, defaultConfig, defaultLayout } from '@/lib/plotly'

export const Component = () => (
  <section>
    <Plot data={[]} layout={defaultLayout} config={defaultConfig} />
  </section>
)

Component.displayName = 'Variable'
