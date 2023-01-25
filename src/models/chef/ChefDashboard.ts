export default interface ChefEarning {
  _id: any
  total_cost_month: Number,
  consumers: ConsumerEarning[]
}

interface ConsumerEarning {
  name: String,
  total: Number,
  tip: Number
}