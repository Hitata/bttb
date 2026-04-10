import type { LineValue, TrigramData, HexagramName, HexagramInfo } from './types'

// ---------------------------------------------------------------------------
// TRIGRAMS — indexed 0-7 by binary value (line1 = LSB, line3 = MSB)
// ---------------------------------------------------------------------------

export const TRIGRAMS: TrigramData[] = [
  // Indexed by binary value: line1 (bottom) = LSB, line3 (top) = MSB
  // Binary '011' = bottom Yang, mid Yang, top Yin = Đoài ☱ (Lake, yin on top)
  // Binary '110' = bottom Yin, mid Yang, top Yang = Tốn ☴ (Wind, yin enters below)
  { index: 0, binary: '000', symbol: '☷', name: 'Khôn',  zh: '坤' },
  { index: 1, binary: '001', symbol: '☳', name: 'Chấn',  zh: '震' },
  { index: 2, binary: '010', symbol: '☵', name: 'Khảm',  zh: '坎' },
  { index: 3, binary: '011', symbol: '☱', name: 'Đoài',  zh: '兌' },
  { index: 4, binary: '100', symbol: '☶', name: 'Cấn',   zh: '艮' },
  { index: 5, binary: '101', symbol: '☲', name: 'Ly',    zh: '離' },
  { index: 6, binary: '110', symbol: '☴', name: 'Tốn',   zh: '巽' },
  { index: 7, binary: '111', symbol: '☰', name: 'Càn',   zh: '乾' },
]

// ---------------------------------------------------------------------------
// KING_WEN sequence — KING_WEN[upper][lower] = hexagram number (1-64)
// Upper trigram index (0-7) as row, lower trigram index (0-7) as column.
// ---------------------------------------------------------------------------

export const KING_WEN: number[][] = [
  //  lower: 0   1   2   3   4   5   6   7
  //         坤  震  坎  兌  艮  離  巽  乾
  [    2,  24,   7,  19,  15,  36,  46,  11 ],  // 0 坤 Khôn
  [   16,  51,  40,  54,  62,  55,  32,  34 ],  // 1 震 Chấn
  [    8,   3,  29,  60,  39,  63,  48,   5 ],  // 2 坎 Khảm
  [   45,  17,  47,  58,  31,  49,  28,  43 ],  // 3 兌 Đoài
  [   23,  27,   4,  41,  52,  22,  18,  26 ],  // 4 艮 Cấn
  [   35,  21,  64,  38,  56,  30,  50,  14 ],  // 5 離 Ly
  [   20,  42,  59,  61,  53,  37,  57,   9 ],  // 6 巽 Tốn
  [   12,  25,   6,  10,  33,  13,  44,   1 ],  // 7 乾 Càn
]

// ---------------------------------------------------------------------------
// HEXAGRAM_NAMES — all 64 hexagrams with Vietnamese, Chinese, English names
// ---------------------------------------------------------------------------

export const HEXAGRAM_NAMES: Record<number, HexagramName> = {
   1: { vi: 'Càn',      zh: '乾', en: 'The Creative'       },
   2: { vi: 'Khôn',     zh: '坤', en: 'The Receptive'      },
   3: { vi: 'Truân',    zh: '屯', en: 'Difficulty at the Beginning' },
   4: { vi: 'Mông',     zh: '蒙', en: 'Youthful Folly'     },
   5: { vi: 'Nhu',      zh: '需', en: 'Waiting'            },
   6: { vi: 'Tụng',     zh: '訟', en: 'Conflict'           },
   7: { vi: 'Sư',       zh: '師', en: 'The Army'           },
   8: { vi: 'Tỷ',       zh: '比', en: 'Holding Together'   },
   9: { vi: 'Tiểu Súc', zh: '小畜', en: 'Small Taming'    },
  10: { vi: 'Lý',       zh: '履', en: 'Treading'           },
  11: { vi: 'Thái',     zh: '泰', en: 'Peace'              },
  12: { vi: 'Bĩ',       zh: '否', en: 'Standstill'         },
  13: { vi: 'Đồng Nhân',zh: '同人', en: 'Fellowship'       },
  14: { vi: 'Đại Hữu',  zh: '大有', en: 'Great Possession' },
  15: { vi: 'Khiêm',    zh: '謙', en: 'Modesty'            },
  16: { vi: 'Dự',       zh: '豫', en: 'Enthusiasm'         },
  17: { vi: 'Tùy',      zh: '隨', en: 'Following'          },
  18: { vi: 'Cổ',       zh: '蠱', en: 'Work on the Decayed'},
  19: { vi: 'Lâm',      zh: '臨', en: 'Approach'           },
  20: { vi: 'Quan',     zh: '觀', en: 'Contemplation'      },
  21: { vi: 'Phệ Hạp',  zh: '噬嗑', en: 'Biting Through'   },
  22: { vi: 'Bí',       zh: '賁', en: 'Grace'              },
  23: { vi: 'Bác',      zh: '剝', en: 'Splitting Apart'    },
  24: { vi: 'Phục',     zh: '復', en: 'Return'             },
  25: { vi: 'Vô Vọng',  zh: '無妄', en: 'Innocence'        },
  26: { vi: 'Đại Súc',  zh: '大畜', en: 'Great Taming'     },
  27: { vi: 'Di',       zh: '頤', en: 'Nourishment'        },
  28: { vi: 'Đại Quá',  zh: '大過', en: 'Great Excess'     },
  29: { vi: 'Khảm',     zh: '坎', en: 'The Abysmal'        },
  30: { vi: 'Ly',       zh: '離', en: 'The Clinging'       },
  31: { vi: 'Hàm',      zh: '咸', en: 'Influence'          },
  32: { vi: 'Hằng',     zh: '恆', en: 'Duration'           },
  33: { vi: 'Độn',      zh: '遁', en: 'Retreat'            },
  34: { vi: 'Đại Tráng',zh: '大壯', en: 'Great Power'      },
  35: { vi: 'Tấn',      zh: '晉', en: 'Progress'           },
  36: { vi: 'Minh Di',  zh: '明夷', en: 'Darkening of the Light' },
  37: { vi: 'Gia Nhân', zh: '家人', en: 'The Family'        },
  38: { vi: 'Khuê',     zh: '睽', en: 'Opposition'         },
  39: { vi: 'Kiển',     zh: '蹇', en: 'Obstruction'        },
  40: { vi: 'Giải',     zh: '解', en: 'Deliverance'        },
  41: { vi: 'Tổn',      zh: '損', en: 'Decrease'           },
  42: { vi: 'Ích',       zh: '益', en: 'Increase'          },
  43: { vi: 'Quải',     zh: '夬', en: 'Breakthrough'       },
  44: { vi: 'Cấu',      zh: '姤', en: 'Coming to Meet'     },
  45: { vi: 'Tụy',      zh: '萃', en: 'Gathering Together' },
  46: { vi: 'Thăng',    zh: '升', en: 'Pushing Upward'     },
  47: { vi: 'Khốn',     zh: '困', en: 'Oppression'         },
  48: { vi: 'Tỉnh',     zh: '井', en: 'The Well'           },
  49: { vi: 'Cách',     zh: '革', en: 'Revolution'         },
  50: { vi: 'Đỉnh',     zh: '鼎', en: 'The Cauldron'       },
  51: { vi: 'Chấn',     zh: '震', en: 'The Arousing'       },
  52: { vi: 'Cấn',      zh: '艮', en: 'Keeping Still'      },
  53: { vi: 'Tiệm',     zh: '漸', en: 'Development'        },
  54: { vi: 'Quy Muội', zh: '歸妹', en: 'The Marrying Maiden' },
  55: { vi: 'Phong',    zh: '豐', en: 'Abundance'          },
  56: { vi: 'Lữ',       zh: '旅', en: 'The Wanderer'       },
  57: { vi: 'Tốn',      zh: '巽', en: 'The Gentle'         },
  58: { vi: 'Đoài',     zh: '兌', en: 'The Joyous'         },
  59: { vi: 'Hoán',     zh: '渙', en: 'Dispersion'         },
  60: { vi: 'Tiết',     zh: '節', en: 'Limitation'         },
  61: { vi: 'Trung Phu',zh: '中孚', en: 'Inner Truth'       },
  62: { vi: 'Tiểu Quá', zh: '小過', en: 'Small Excess'      },
  63: { vi: 'Ký Tế',    zh: '既濟', en: 'After Completion'  },
  64: { vi: 'Vị Tế',    zh: '未濟', en: 'Before Completion' },
}

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Convert 3 line values to a trigram index (0-7). Lines are bottom-to-top.
 * Each line: yin (values 6, 8) = 0 bit, yang (values 7, 9) = 1 bit.
 * Line 1 is the least significant bit.
 */
export function linesToTrigramIndex(line1: number, line2: number, line3: number): number {
  const bit1 = (line1 === 7 || line1 === 9) ? 1 : 0  // LSB
  const bit2 = (line2 === 7 || line2 === 9) ? 1 : 0
  const bit3 = (line3 === 7 || line3 === 9) ? 1 : 0  // MSB
  return bit1 | (bit2 << 1) | (bit3 << 2)
}

/**
 * Compute the nuclear hexagram (Hỗ quái) number from 6 lines.
 * Lower nuclear trigram = lines[1], lines[2], lines[3] (0-indexed: lines 2,3,4 in 1-indexed)
 * Upper nuclear trigram = lines[2], lines[3], lines[4] (0-indexed: lines 3,4,5 in 1-indexed)
 */
export function computeNuclearNumber(lines: LineValue[]): number {
  const lowerIdx = linesToTrigramIndex(lines[1], lines[2], lines[3])
  const upperIdx = linesToTrigramIndex(lines[2], lines[3], lines[4])
  return KING_WEN[upperIdx][lowerIdx]
}

/**
 * Look up full hexagram info from 6 line values (bottom to top).
 */
export function lookupHexagram(lines: LineValue[]): HexagramInfo {
  if (lines.length !== 6) {
    throw new Error(`lookupHexagram requires exactly 6 lines, got ${lines.length}`)
  }

  // Lower trigram: lines 1-3 (indices 0-2)
  const lowerIndex = linesToTrigramIndex(lines[0], lines[1], lines[2])
  // Upper trigram: lines 4-6 (indices 3-5)
  const upperIndex = linesToTrigramIndex(lines[3], lines[4], lines[5])

  const hexNumber = KING_WEN[upperIndex][lowerIndex]
  const name = HEXAGRAM_NAMES[hexNumber]
  const upper = TRIGRAMS[upperIndex]
  const lower = TRIGRAMS[lowerIndex]

  return {
    number: hexNumber,
    name,
    upperTrigram: { symbol: upper.symbol, name: upper.name },
    lowerTrigram: { symbol: lower.symbol, name: lower.name },
    nuclearNumber: computeNuclearNumber(lines),
  }
}
