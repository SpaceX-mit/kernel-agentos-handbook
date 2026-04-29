// futures/forecast — public surface.

export type { Signal, Trend, Horizon, Forecast } from './types.js'
export { HORIZON_MS } from './types.js'
export {
  linearProjection,
  exponentialProjection,
  flatProjection,
  bestProjection,
  clampHorizon,
  signalHistory,
} from './projection.js'
export { synthesizeForecasts, formatForecast, narrative } from './synthesize.js'
