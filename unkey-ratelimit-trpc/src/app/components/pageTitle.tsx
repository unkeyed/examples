interface PageTitleProps {
	title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
	return (
		<div className="flex flex-row w-full shadow-lg  shadow-slate-700 items-start justify-center py-4 bg-gradient-to-tl from-slate-300 to-slate-500 rounded-lg">
			<h2 className="text-center bg-gradient-to-tl from-slate-700 to-slate-900 bg-clip-text text-transparent font-semibold text-3xl ">
				{title.toUpperCase()}
			</h2>
		</div>
	);
};

export default PageTitle;
