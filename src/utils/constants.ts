export const IS_MOBILE =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export const BLOCK_PARAMS = {
  count: 3,
  translateVerticallyOnDrag: IS_MOBILE ? -75 : 0,
  // translateVerticallyOnDrag: 0,
};

export const GRID_PARAMS = {
  rows: 9,
  columns: 9,
  boxRows: 3,
  boxColumns: 3,
  width: 333,
  cellBorderColor: "#444444",
  boxBorderColor: "#666666",
};

export const PARAMS = {
  grid: GRID_PARAMS,
  block: BLOCK_PARAMS,
};
