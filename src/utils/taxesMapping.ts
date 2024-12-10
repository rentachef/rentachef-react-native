export function _getTaxPercentageByState(state: string): number | undefined {
    let upperState = state.toUpperCase()
    switch(upperState) {
      case 'TEXAS':
        return 8.25
      default:
        return 0
    }
  }