'use strict';

import React from 'react';
import { Box, Text, Card } from 'theme-ui';

type UsageEntry = {
	location: string;
	kind: string;
	code: string;
};

type UsagesListProps = {
	usages: Record<string, UsageEntry[]>;
};

/**
 * UsagesList - Show all mnemonica type usages
 * 
 * Filters and displays different kinds of usages:
 * - definitions: Where types are defined
 * - instantiations: Where new types are created
 * - propertyAccess: Where instance inheritance happens (key!)
 */
export const UsagesList: React.FC<UsagesListProps> = ({ usages }) => {
	const allTypes = Object.keys(usages).sort();

	// Group by kind
	const byKind: Record<string, [string, UsageEntry[]][]> = {
		definition     : [],
		instantiation  : [],
		propertyAccess : []
	};

	for (const type of allTypes) {
		const entries = usages[ type ];
		for (const entry of entries) {
			if (!byKind[ entry.kind ]) {
				byKind[ entry.kind ] = [];
			}
			// Only add once per type per kind
			const existing = byKind[ entry.kind ].find(([ t ]) => t === type);
			if (!existing) {
				byKind[ entry.kind ].push([ type, entries ]);
			}
		}
	}

	const renderKindSection = (title: string, kind: string, color: string) => {
		const types = byKind[ kind ] || [];
		if (types.length === 0) return null;

		return (
			<Box sx={{ mb : 4 }}>
				<Text sx={{ 
					fontSize   : 3, 
					fontWeight : 'bold', 
					mb         : 2,
					color
				}}>
					{title} ({types.length})
				</Text>
				{types.map(([ type, entries ]) => (
					<Card key={type} sx={{ mb : 2, p : 2, bg : 'muted' }}>
						<Text sx={{ fontWeight : 'bold', fontFamily : 'monospace' }}>
							{type}
						</Text>
						{entries
							.filter(e => e.kind === kind)
							.map((entry, i) => (
								<Box key={i} sx={{ mt : 1, ml : 2 }}>
									<Text sx={{ 
										fontSize     : 0, 
										fontFamily   : 'monospace',
										bg           : 'background',
										p            : 1,
										borderRadius : 1
									}}>
										{entry.code.slice(0, 80)}
										{entry.code.length > 80 ? '...' : ''}
									</Text>
									<Text sx={{ fontSize : 0, color : 'text', mt : 1 }}>
										at {entry.location}
									</Text>
								</Box>
							))}
					</Card>
				))}
			</Box>
		);
	};

	return (
		<Box sx={{ p : 3 }}>
			<Text sx={{ fontSize : 4, fontWeight : 'bold', mb : 3 }}>
				Type Usages
			</Text>

			{/* Property Access = Instance Inheritance (most important) */}
			{renderKindSection('Instance Inheritance', 'propertyAccess', 'primary')}

			{/* Definitions */}
			{renderKindSection('Type Definitions', 'definition', 'secondary')}

			{/* Instantiations */}
			{renderKindSection('Instantiations', 'instantiation', 'text')}
		</Box>
	);
};

export default UsagesList;
