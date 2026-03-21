'use strict';

import React from 'react';
import { Box, Text, Card } from 'theme-ui';

// Types for tactica output
type TypeGraphNode = {
	name: string;
	fullPath: string;
	properties: { name: string; type: string; optional: boolean; readonly: boolean }[];
	children: TypeGraphNode[];
	sourceFile: string;
	line: number;
	column: number;
};

type TypeGraphJson = {
	version: string;
	generatedAt: string;
	roots: TypeGraphNode[];
};

type UsageEntry = {
	location: string;
	kind: string;
	code: string;
};

type UsagesJson = {
	usages: Record<string, UsageEntry[]>;
};

type TypeFlowProps = {
	typeGraph: TypeGraphJson;
	usages: UsagesJson;
};

/**
 * TypeFlow - Visualize mnemonica data flow
 * 
 * Shows the type hierarchy and how data flows through the system.
 * This is the KEY visualization demonstrating instance inheritance.
 */
export const TypeFlow: React.FC<TypeFlowProps> = ({ typeGraph, usages }) => {
	const renderNode = (node: TypeGraphNode, depth: number = 0) => {
		const nodeUsages = usages.usages[node.fullPath] || [];
		const instantiations = nodeUsages.filter(u => u.kind === 'instantiation');
		const propertyAccesses = nodeUsages.filter(u => u.kind === 'propertyAccess');

		return (
			<Box key={node.fullPath} sx={{ ml: depth * 4 }}>
				<Card sx={{ 
					mb: 2, 
					p: 2, 
					bg: depth === 0 ? 'primary' : 'secondary',
					color: 'white'
				}}>
					<Text sx={{ fontWeight: 'bold', fontSize: depth === 0 ? 3 : 2 }}>
						{node.name}
					</Text>
					<Text sx={{ fontSize: 0, opacity: 0.8 }}>
						{node.sourceFile}:{node.line}
					</Text>
					
					{/* Properties */}
					{node.properties.length > 0 && (
						<Box sx={{ mt: 2, fontSize: 1 }}>
							<Text sx={{ fontWeight: 'bold' }}>Properties:</Text>
							{node.properties.map(prop => (
								<Text key={prop.name} sx={{ ml: 2, fontFamily: 'monospace' }}>
									{prop.name}: {prop.type}
									{prop.optional && '?'}
									{prop.readonly && ' (readonly)'}
								</Text>
							))}
						</Box>
					)}

					{/* Usage counts */}
					<Box sx={{ mt: 2, fontSize: 0 }}>
						<Text>
							Instantiations: {instantiations.length} | 
							Property Accesses: {propertyAccesses.length}
						</Text>
					</Box>
				</Card>

				{/* Children = nested types (instance inheritance) */}
				{node.children.length > 0 && (
					<Box sx={{ pl: 3, borderLeft: '2px solid', borderColor: 'muted' }}>
						{node.children.map(child => renderNode(child, depth + 1))}
					</Box>
				)}
			</Box>
		);
	};

	return (
		<Box sx={{ p: 3 }}>
			<Text sx={{ fontSize: 4, fontWeight: 'bold', mb: 3 }}>
				Mnemonica Data Flow
			</Text>
			<Text sx={{ mb: 3, color: 'text' }}>
				Generated: {new Date(typeGraph.generatedAt).toLocaleString()}
			</Text>

			<Box>
				{typeGraph.roots.map(root => renderNode(root))}
			</Box>

			{/* Show the key instance inheritance usage */}
			{usages.usages['List.Slide'] && (
				<Card sx={{ mt: 4, p: 3, bg: 'highlight' }}>
					<Text sx={{ fontWeight: 'bold', fontSize: 2, mb: 2 }}>
						Instance Inheritance Pattern (Key!)
					</Text>
					{usages.usages['List.Slide'].map((usage, i) => (
						<Box key={i} sx={{ mb: 2 }}>
							<Text sx={{ fontFamily: 'monospace', fontSize: 1 }}>
								{usage.code}
							</Text>
							<Text sx={{ fontSize: 0, color: 'text' }}>
								at {usage.location}
							</Text>
						</Box>
					))}
				</Card>
			)}
		</Box>
	);
};

export default TypeFlow;
