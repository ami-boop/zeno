import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

export default function HelpPage() {
	return (
		<div className='relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden'>
			<div className='layout-container flex h-full grow flex-col'>
				<div className='px-40 flex flex-1 justify-center py-5'>
					<div className='layout-content-container flex flex-col max-w-[960px] flex-1'>
						<div className='flex flex-wrap justify-between gap-3 p-4'>
							<div className='flex min-w-72 flex-col gap-3'>
								<p className='text-[#111518] tracking-light text-[32px] font-bold leading-tight'>
									Help &amp; Support
								</p>
								<p className='text-[#617889] text-sm font-normal leading-normal'>
									Find answers to common questions or contact us directly for
									assistance.
								</p>
							</div>
						</div>

						<h2 className='text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5'>
							Frequently Asked Questions
						</h2>
						<Accordion
							type='single'
							collapsible
							className='flex flex-col p-4 gap-3'
						>
							<AccordionItem
								value='item-1'
								className='rounded-xl border border-[#dbe1e6] bg-white px-[15px] py-[7px]'
							>
								<AccordionTrigger className='text-[#111518] text-sm font-medium leading-normal py-2'>
									How do I track my bus?
								</AccordionTrigger>
								<AccordionContent className='text-[#617889] text-sm font-normal leading-normal pb-2'>
									You can track your bus in real time using our mobile app or
									the web dashboard under the Routes section.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value='item-2'
								className='rounded-xl border border-[#dbe1e6] bg-white px-[15px] py-[7px]'
							>
								<AccordionTrigger className='text-[#111518] text-sm font-medium leading-normal py-2'>
									What should I do if my bus is late?
								</AccordionTrigger>
								<AccordionContent className='text-[#617889] text-sm font-normal leading-normal pb-2'>
									Please check for real-time updates and contact support if the
									delay exceeds 15 minutes.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value='item-3'
								className='rounded-xl border border-[#dbe1e6] bg-white px-[15px] py-[7px]'
							>
								<AccordionTrigger className='text-[#111518] text-sm font-medium leading-normal py-2'>
									How can I update my contact information?
								</AccordionTrigger>
								<AccordionContent className='text-[#617889] text-sm font-normal leading-normal pb-2'>
									You can update your contact information in your account
									settings under the Profile tab.
								</AccordionContent>
							</AccordionItem>
						</Accordion>

						<h2 className='text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5'>
							Contact Us
						</h2>
						<div className='flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3'>
							<label className='flex flex-col min-w-40 flex-1'>
								<p className='text-[#111518] text-base font-medium leading-normal pb-2'>
									Your Name
								</p>
								<input
									placeholder='Enter your name'
									className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] focus:outline-0 focus:ring-0 border border-[#dbe1e6] bg-white focus:border-[#dbe1e6] h-14 placeholder:text-[#617889] p-[15px] text-base font-normal leading-normal'
								/>
							</label>
						</div>
						<div className='flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3'>
							<label className='flex flex-col min-w-40 flex-1'>
								<p className='text-[#111518] text-base font-medium leading-normal pb-2'>
									Email Address
								</p>
								<input
									placeholder='Enter your email'
									className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] focus:outline-0 focus:ring-0 border border-[#dbe1e6] bg-white focus:border-[#dbe1e6] h-14 placeholder:text-[#617889] p-[15px] text-base font-normal leading-normal'
								/>
							</label>
						</div>
						<div className='flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3'>
							<label className='flex flex-col min-w-40 flex-1'>
								<p className='text-[#111518] text-base font-medium leading-normal pb-2'>
									Your Question
								</p>
								<textarea
									placeholder='Describe your issue or question'
									className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] focus:outline-0 focus:ring-0 border border-[#dbe1e6] bg-white focus:border-[#dbe1e6] min-h-36 placeholder:text-[#617889] p-[15px] text-base font-normal leading-normal'
								/>
							</label>
						</div>
						<div className='flex px-4 py-3 justify-end'>
							<button className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#138deb] text-white text-sm font-bold leading-normal tracking-[0.015em]'>
								<span className='truncate'>Submit</span>
							</button>
						</div>

						<h2 className='text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5'>
							Call Us
						</h2>
						<p className='text-[#111518] text-base font-normal leading-normal pb-3 pt-1 px-4'>
							For immediate assistance, call us at +972 053 483 7300. Our
							support team is available Monday to Friday, 9 AM to 5 PM.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
