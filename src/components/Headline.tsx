import type { SortOption } from '../types';

type HeadlineProps = {
    resultsCount: number;
    sortBy: SortOption;
    onSortChange: (sortBy: SortOption) => void;
};

const Sort = ({ sortBy, onSortChange }: { sortBy: SortOption; onSortChange: (sortBy: SortOption) => void }) => {
    return (
        <div className="flex" style={{ gap: '12px' }}>
            <span
                style={{
                    fontFamily: 'Epilogue',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '160%',
                    letterSpacing: '0%',
                    textAlign: 'right',
                    height: '26px',
                    color: '#7C8493'
                }}
            >
                Sort By:
            </span>
            <div className="relative flex items-center" style={{ gap: '8px' }}>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        onSortChange(e.target.value as SortOption);
                    }}
                    className="appearance-none bg-transparent font-medium text-gray-900 cursor-pointer focus:outline-none"
                    style={{
                        fontFamily: 'Epilogue',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '160%',
                        letterSpacing: '0%',
                        height: '26px',
                        border: 'none'
                    }}
                >
                    <option value="Most relevant">Most relevant</option>
                    <option value="Most recent">Most recent</option>
                </select>
                <div className="pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke="#4640DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke="black" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

const Headline = ({ resultsCount, sortBy, onSortChange }: HeadlineProps) => {
    return (
        <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
            <div className='flex flex-col'>
                <h1
                    className="font-black text-gray-900"
                    style={{
                        fontFamily: 'Poppins',
                        fontWeight: 900,
                        fontSize: '32px',
                        lineHeight: '120%',
                        letterSpacing: '0%',
                        marginBottom: '4px'
                    }}
                >
                    Opportunities
                </h1>

                <p
                    style={{
                        fontFamily: 'Epilogue',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '160%',
                        letterSpacing: '0%',
                        color: '#7C8493'
                    }}
                >
                    Showing {resultsCount} results
                </p>
            </div>

            {/* Note: Using gap of 21px rather than 22px to accomodate for differences between figma and css. */}
            <div className="flex items-center" style={{ gap: '21px' }}>
                <Sort sortBy={sortBy} onSortChange={onSortChange} />

                <div
                    style={{
                        width: '0px',
                        height: '32px',
                        borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                        // Note: How the opacity is actually dispayed (how dark the element looks) might depend on your device!
                        opacity: 0.1
                    }}
                />
            </div>
        </div>
    );
};

export default Headline;

