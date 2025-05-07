import React from 'react';

const mockData = [
    {
        name: 'ISoC2025',
        description: 'IEEE Summer Of Code Website',
        updated: 'about 4 hours ago',
        stars: 6,
        forks: 1,
        issues: 1,
        activity: 100,
        language: 'JavaScript',
    },
    {
        name: 'Chat-Bot',
        description: 'chat-gpt based chat-bot',
        updated: '4 days ago',
        stars: 0,
        forks: 1,
        issues: 0,
        activity: 92,
        language: 'JavaScript',
    },
    {
        name: 'linktree',
        description: 'No description provided',
        updated: '5 days ago',
        stars: 0,
        forks: 1,
        issues: 0,
        activity: 91,
        language: 'TypeScript',
    },
    {
        name: 'PoTM-M',
        description: 'Project of the Month',
        updated: '21 days ago',
        stars: 0,
        forks: 1,
        issues: 0,
        activity: 70,
        language: 'TypeScript',
    },
];

const languageColors = {
    JavaScript: 'bg-yellow-400 text-black',
    TypeScript: 'bg-blue-500 text-white',
};

const Repositories = () => {
    return (
        <div className="py-7 px-4 bg-[#1c1f2b] min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-6">Active Repositories</h2>
            <div className='bg-[#252a3b] rounded-lg overflow-hidden'>
                {mockData.map((repo, idx) => (
                    <div key={idx} className="p-4 bg-[#252a3b]">
                        <div className="flex justify-between items-center mb-1">
                            <div className='px-4 py-5'>
                                <h3 className="text-lg font-semibold">{repo.name}</h3>
                                <p className="text-sm text-gray-400">{repo.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Updated: {repo.updated}
                                </p>
                            </div>
                            <span
                                className={`px-4 py-1 rounded-full text-xs font-semibold ${languageColors[repo.language]}`}
                            >
                                {repo.language}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-yellow-400 gap-4 px-4">
                            <span>⭐ {repo.stars}</span>
                            <span>🍴 {repo.forks}</span>
                            <span>🐛 {repo.issues}</span>
                        </div>
                        <div className="mt-3 px-4">
                            <div className="text-xs text-gray-400 mb-1">Activity</div>
                            <div className="w-full bg-gray-700 h-2 rounded-full">
                                <div
                                    className="bg-purple-400 h-2 rounded-full"
                                    style={{ width: `${repo.activity}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-xs mt-1 text-gray-400">
                                {repo.activity}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Repositories;
