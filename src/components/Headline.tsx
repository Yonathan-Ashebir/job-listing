import { useState, useRef, useEffect } from 'react';
import type { SortOption } from '../types';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { useAuth } from '../auth/AuthContext';

type HeadlineProps = {
    resultsCount: number;
    sortBy: SortOption;
    onSortChange: (sortBy: SortOption) => void;
};

const Sort = ({ sortBy, onSortChange }: { sortBy: SortOption; onSortChange: (sortBy: SortOption) => void }) => {
    return (
        <div className="flex flex-nowrap items-center" style={{ gap: dimensions.spacing.md, flexShrink: 0 }}>
            <span
                className="text-right whitespace-nowrap"
                style={{
                    fontFamily: fonts.epilogue,
                    fontWeight: typography.fontWeights.regular,
                    fontSize: typography.fontSizes.sm,
                    lineHeight: typography.lineHeights.normal,
                    letterSpacing: typography.letterSpacing.none,
                    height: dimensions.heights.sortLabel,
                    color: colors.gray.medium,
                    flexShrink: 0,
                }}
            >
                Sort By:
            </span>
            <div className="relative flex items-center flex-nowrap" style={{ gap: dimensions.spacing.sm, flexShrink: 0 }}>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        onSortChange(e.target.value as SortOption);
                    }}
                    className="appearance-none bg-transparent font-medium text-gray-900 cursor-pointer focus:outline-none border-none whitespace-nowrap"
                    style={{
                        fontFamily: fonts.epilogue,
                        fontWeight: typography.fontWeights.medium,
                        fontSize: typography.fontSizes.sm,
                        lineHeight: typography.lineHeights.normal,
                        letterSpacing: typography.letterSpacing.none,
                        height: dimensions.heights.sortLabel,
                        flexShrink: 0,
                    }}
                >
                    <option value="Most relevant">Most relevant</option>
                    <option value="Most recent">Most recent</option>
                </select>
                <div className="pointer-events-none flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke={colors.primary.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke={colors.black} strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke={colors.black} strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

const UserIcon = () => {
    const { user, signout } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsHovered(false);
            }
        };

        if (isHovered) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isHovered]);

    if (!user) {
        return null;
    }

    return (
        <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ cursor: 'pointer' }}
        >
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: user.profilePicUrl ? 'transparent' : colors.primary.blue,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.white,
                    fontFamily: fonts.epilogue,
                    fontWeight: typography.fontWeights.semibold,
                    fontSize: typography.fontSizes.sm,
                    overflow: 'hidden',
                    backgroundImage: user.profilePicUrl ? `url(${user.profilePicUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {!user.profilePicUrl && user.name.charAt(0).toUpperCase()}
            </div>
            
            {isHovered && (
                <div
                    className="dropdown-enter"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: dimensions.spacing.sm,
                        backgroundColor: colors.white,
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        padding: dimensions.spacing.md,
                        minWidth: '250px',
                        zIndex: 1000,
                    }}
                >
                    {/* Triangle arrow pointing to user icon */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '12px',
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderBottom: '8px solid white',
                            filter: 'drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.1))',
                        }}
                    />
                    <div style={{ marginBottom: dimensions.spacing.md }}>
                        <div
                            style={{
                                fontFamily: fonts.epilogue,
                                fontWeight: typography.fontWeights.semibold,
                                fontSize: typography.fontSizes.sm,
                                color: colors.gray.dark,
                                marginBottom: dimensions.spacing.xs,
                            }}
                        >
                            {user.name}
                        </div>
                        <div
                            style={{
                                fontFamily: fonts.epilogue,
                                fontSize: typography.fontSizes.xs,
                                color: colors.gray.medium,
                                marginBottom: dimensions.spacing.xs,
                            }}
                        >
                            {user.email}
                        </div>
                        <div
                            style={{
                                fontFamily: fonts.epilogue,
                                fontSize: typography.fontSizes.xs,
                                color: colors.gray.medium,
                                textTransform: 'capitalize',
                            }}
                        >
                            Role: {user.role}
                        </div>
                        {user.profileStatus && (
                            <div
                                style={{
                                    fontFamily: fonts.epilogue,
                                    fontSize: typography.fontSizes.xs,
                                    color: user.profileComplete ? colors.primary.green : colors.primary.orange,
                                    marginTop: dimensions.spacing.xs,
                                    textTransform: 'capitalize',
                                }}
                            >
                                Profile: {user.profileStatus}
                            </div>
                        )}
                    </div>
                    <div
                        style={{
                            borderTop: `1px solid ${colors.gray.light}`,
                            paddingTop: dimensions.spacing.sm,
                        }}
                    >
                        <button
                            onClick={signout}
                            style={{
                                width: '100%',
                                padding: dimensions.spacing.sm,
                                backgroundColor: colors.primary.blue,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '6px',
                                fontFamily: fonts.epilogue,
                                fontWeight: typography.fontWeights.semibold,
                                fontSize: typography.fontSizes.sm,
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#3A35C7';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = colors.primary.blue;
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Headline = ({ resultsCount, sortBy, onSortChange }: HeadlineProps) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className='flex flex-col'>
                <h1
                    className="font-black text-gray-900 mb-1"
                    style={{
                        fontFamily: fonts.poppins,
                        fontWeight: typography.fontWeights.black,
                        fontSize: typography.fontSizes.lg,
                        lineHeight: typography.lineHeights.tight,
                        letterSpacing: typography.letterSpacing.none,
                    }}
                >
                    Opportunities
                </h1>

                <p
                    style={{
                        fontFamily: fonts.epilogue,
                        fontWeight: typography.fontWeights.regular,
                        fontSize: typography.fontSizes.sm,
                        lineHeight: typography.lineHeights.normal,
                        letterSpacing: typography.letterSpacing.none,
                        color: colors.gray.medium,
                    }}
                >
                    Showing {resultsCount} results
                </p>
            </div>

            <div className="flex items-center" style={{ gap: dimensions.spacing.lg, marginLeft: '20px' }}>
                <Sort sortBy={sortBy} onSortChange={onSortChange} />

                <UserIcon />

                <div
                    className="opacity-10"
                    style={{
                        width: '0px',
                        height: dimensions.sizes.divider.height,
                        borderLeft: `1px solid ${colors.blackOpacity}`,
                    }}
                />
            </div>
        </div>
    );
};

export default Headline;

