const baseStyle = {
  menuList: {
    overflowY: 'auto',
    m: '0',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: 'overlay',
    border: 'none',
    borderRadius: '0',
  },
  icon: {
    w: 6,
    h: 6,
  },
};

const TableOfContent = {
  parts: ['menuList', 'icon'],
  baseStyle,
};

export default TableOfContent;
