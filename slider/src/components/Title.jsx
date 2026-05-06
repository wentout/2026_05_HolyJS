import React from 'react';

const Title = function () {
	Object.assign(this, this.slides.current);
};

Title.prototype.View = function () {
	return (
		<div className="SlideContent">
			<div className="Title" >
				<h1>{this.title}</h1>
				<h1 className="subtitle">{this.subtitle}</h1>

				<div style={{
					display: 'flex',
					alignItems: 'center',
					marginTop: '-11.6vh',
					marginLeft: '-3.4vw',
					width: 'fit-content'
				}}>
					<img style={{
						width: '19vh',
						height: '19vh',
						borderRadius: '50%',
						border: '3px solid #ff69b4',
						objectFit: 'cover'
					}} src="./content/avatar.png" alt="speaker" />
					<div style={{
						marginLeft: '5vw',
						fontSize: '4.5vh',
						fontWeight: 700,
						color: '#ffffff',
						lineHeight: 1.2,
						textAlign: 'left'
					}}>Виктор<br />Вершанский</div>
				</div>

			</div>
		</div >
	);
};

export default Title;