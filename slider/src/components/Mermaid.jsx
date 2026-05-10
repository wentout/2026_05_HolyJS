import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

let initialized = false;

const Mermaid = ({ children }) => {
	const containerRef = useRef(null);
	const [svg, setSvg] = useState('');

	useEffect(() => {
		if (!initialized) {
			mermaid.initialize({
				startOnLoad: false,
				theme: 'dark',
				themeVariables: {
					primaryColor: '#1a1a2e',
					primaryTextColor: '#F8F9FA',
					primaryBorderColor: '#00F0FF',
					lineColor: '#00F0FF',
					secondaryColor: '#2d1b4e',
					tertiaryColor: '#0B0B0E',
					fontFamily: 'var(--font-sans)',
					fontSize: '22px'
				}
			});
			initialized = true;
		}

		const source = typeof children === 'string' ? children.trim() : '';
		if (!source) return;

		const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
		mermaid.render(id, source)
			.then(({ svg: renderedSvg }) => {
				setSvg(renderedSvg);
			})
			.catch((err) => {
				console.error('Mermaid render error:', err);
				setSvg(`<pre class="mermaid-error">${err.message}</pre>`);
			});
	}, [children]);

	return (
		<div
			ref={containerRef}
			className="Mermaid"
			dangerouslySetInnerHTML={{ __html: svg }}
			style={{ display: 'flex', justifyContent: 'center' }}
		/>
	);
};

export default Mermaid;
