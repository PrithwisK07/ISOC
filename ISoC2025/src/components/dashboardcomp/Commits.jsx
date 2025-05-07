import React from 'react';
import { useAuth } from '../../context/Authcontext';
import { GitBranch } from 'lucide-react';
import moment from 'moment';

const Commits = () => {
    const { user } = useAuth();
    const commitStats = user?.commitStats?.[0];
    const commits = commitStats?.commits || [];

    console.log(commits);

    return (
        <div className="px-4 py-7 text-white bg-[#1c1f2b]">
            <h1 className="text-2xl font-bold mb-6">Commits</h1>

            <div className="bg-[#21293b] p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Recent Commits</h2>

                {commits.length === 0 ? (
                    <p className="text-gray-400">No commits available.</p>
                ) : (
                    commits.map((commit, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-4 border-b border-gray-700 last:border-b-0"
                        >
                            <div>
                                <a
                                    href={commit.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-md text-blue-400 hover:underline"
                                >
                                    {commit.message}
                                </a>
                                <div className="flex items-center text-sm text-gray-400 mt-1">
                                    <GitBranch className="mr-1" size={16} color='#a993ec' />
                                    {user.displayName || user.username}
                                    <span className="mx-2">•</span>
                                    {moment(commit.date).fromNow()}
                                </div>
                            </div>

                            <div className="flex flex-col items-end space-y-1">
                                <div className='w-15 flex justify-center items-center rounded-full border bg-[#05df7220] border-green-400'>
                                    +{commit.additions}
                                </div>
                                <div className='w-15 flex justify-center items-center rounded-full border bg-[#f03f6820] border-red-400'>
                                    -{commit.deletions}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Commits;
