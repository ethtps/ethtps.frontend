type PatternType =
	| 'plus'
	| 'cross'
	| 'dash'
	| 'cross-dash'
	| 'dot'
	| 'dot-dash'
	| 'disc'
	| 'ring'
	| 'line'
	| 'line-vertical'
	| 'weave'
	| 'zigzag'
	| 'zigzag-vertical'
	| 'diagonal'
	| 'diagonal-right-left'
	| 'square'
	| 'box'
	| 'triangle'
	| 'triangle-inverted'
	| 'diamond'
	| 'diamond-box'

export const getPattern = (i: number): PatternType | null => {
	const patterns: PatternType[] = [
		'plus',
		'cross',
		'dash',
		'cross-dash',
		'dot',
		'dot-dash',
		'disc',
		'ring',
		'line',
		'line-vertical',
		'weave',
		'zigzag',
		'zigzag-vertical',
		'diagonal',
		'diagonal-right-left',
		'square',
		'box',
		'triangle',
		'triangle-inverted',
		'diamond',
		'diamond-box',
	]

	return patterns[i % patterns.length]
}
