import React from 'react';

const Title = function () {
	Object.assign(this, this.slides.current);
};

Title.prototype.View = function () {
	return (
		<div className="SlideContent">
			<div className="Title" >
				<h1>{this.title}</h1>

				<div className="speaker-card">
					<img className="speaker-photo" src="./content/avatar.png" alt="speaker" />
					<div className="speaker-name">Виктор<br />Вершанский</div>
				</div>

				<h3 className="subtitle">{this.subtitle}</h3>

			</div>
		</div >
	);
};

export default Title;