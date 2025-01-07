export interface Action { 
  i: number               // pressed element index
  dx: number              // actual cursor distance from xStart
  dy: number,             // actual cursor distance from yStart
  xStart: number          // x position of start action
  yStart: number          // y position of start action
  toSkip: number          // number of elements to skip - negative value means the opposite direction
  iToSkip: Array<number>  // indexes of elements to skip
  timestamp: number       // timestamp of start pressing element
}