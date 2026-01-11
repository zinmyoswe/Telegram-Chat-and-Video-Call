"use client";
import Header from "@/components/Header";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import React from "react";
import { Globe, Shield, Zap } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";


// 1. DEFINE CHILD COMPONENTS FIRST (To avoid hoisting errors)
const FeatureCard = ({
	icon,
	title,
	desc,
}: {
	icon: React.ReactNode;
	title: string;
	desc: string;
}) => {
	return (
		<div className='p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow text-left'>
			<div className='mb-4'>{icon}</div>
			<h3 className='text-xl font-bold mb-2 dark:text-white'>{title}</h3>
			<p className='text-slate-500 dark:text-slate-400 leading-relaxed'>
				{desc}
			</p>
		</div>
	);
};

// 2. MAIN PAGE COMPONENT
const Page = () => {
	const { isAuthenticated, isLoading } = useConvexAuth();

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner />
			</div>
		);
	}

	if (isAuthenticated) {
		return redirect("/dashboard");
	}

	return (
		<div className='min-h-screen bg-white dark:bg-slate-950 overflow-hidden'>
			<Header />

			<main className='flex flex-col items-center px-4 py-16 sm:px-6 text-center gap-24'>
				{/* Hero Section */}
				<section className='max-w-4xl space-y-8 relative'>
					<div
						className='absolute inset-0 -z-10 bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 
          blur-3xl rounded-full scale-150 opacity-60 animate-pulse'
					></div>

					<div className='space-y-4'>
						<h1 className='text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
							Connect{" "}
							<span className='text-blue-600 dark:text-blue-400'>
								Instantly.
							</span>
							<br />
							<span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500'>
								Chat Smarter.
							</span>
						</h1>
					</div>
				</section>

				{/* Feature Grid - Now FeatureCard is defined and safe to use */}
				<section className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full'>
					<FeatureCard
						icon={<Shield className='w-8 h-8 text-blue-500' />}
						title='End-to-End Encryption'
						desc='Your privacy is our priority. Every message is locked and only you have the key.'
					/>
					<FeatureCard
						icon={<Zap className='w-8 h-8 text-amber-500' />}
						title='Lightning Fast'
						desc='Delivering messages faster than any other application on the market today.'
					/>
					<FeatureCard
						icon={<Globe className='w-8 h-8 text-indigo-500' />}
						title='Cloud-Based'
						desc='Access your messages from multiple devices simultaneously without losing a beat.'
					/>
				</section>
			</main>
		</div>
	);
};

export default Page;