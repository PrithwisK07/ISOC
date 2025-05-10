import React from 'react'
import ProfileComp from '../ProfileComp'

const Profile = () => {
    return (
        <div className="w-full min-h-screen bg-[#1a1f2c] text-white py-7 px-4 shadow-lg space-y-5">
            <h1 className='text-2xl font-bold'>Profile</h1>
            <ProfileComp />

            {/* Collectibles Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Collectibles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Placeholder collectibles */}
                    <div className="bg-[#2a2f45] p-4 rounded-lg shadow-md">
                        <p className="font-medium">Collectible #1</p>
                        <p className="text-sm text-gray-400">Description of item 1</p>
                    </div>
                    <div className="bg-[#2a2f45] p-4 rounded-lg shadow-md">
                        <p className="font-medium">Collectible #2</p>
                        <p className="text-sm text-gray-400">Description of item 2</p>
                    </div>
                    <div className="bg-[#2a2f45] p-4 rounded-lg shadow-md">
                        <p className="font-medium">Collectible #3</p>
                        <p className="text-sm text-gray-400">Description of item 3</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
