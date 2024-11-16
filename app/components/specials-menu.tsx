'use client'

import Image from 'next/image'

export default function SpecialsMenu() {
  return (
    <div className="relative w-full max-w-[800px] h-[1000px] mx-auto overflow-hidden bg-black">
      {/* Background Image - darker opacity */}
      <Image
        src="/images/menu-bg.jpg"
        alt=""
        fill
        className="object-cover opacity-10"
      />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff9900] to-[#ffcc00] py-1.5 px-6">
          <div className="flex justify-between items-center">
            <div className="text-black text-xl font-bold tracking-wider">
              WWW.OHTOMMYSIRISHPUB.COM
            </div>
            <div className="text-black text-xl font-bold">
              573-347-3133
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow px-8 py-6 text-white">
          <h1 className="text-7xl font-oswald tracking-wider text-center mb-10 font-normal uppercase">
            WEEKLY SPECIALS
          </h1>

          <div className="grid grid-cols-2 gap-x-16 gap-y-8">
            {/* Thursday */}
            <div>
              <h2 className="text-5xl mb-6 text-[#ffcc00] font-amithen italic">
                Thursday
              </h2>
              <div className="space-y-2.5 font-oswald">
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">CHICKEN FRIED CHICKEN</span>
                  <span className="text-xl text-[#ffcc00] ml-8">14.99</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">MARINATED PORK CHOP</span>
                  <span className="text-xl text-[#ffcc00] ml-8">17.99</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">PORK TENDERLOIN</span>
                  <span className="text-xl text-[#ffcc00] ml-8">10.49</span>
                </div>
              </div>
            </div>

            {/* Friday */}
            <div>
              <h2 className="text-5xl mb-6 text-[#ffcc00] font-amithen italic">
                Friday
              </h2>
              <div className="space-y-2.5 font-oswald">
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">1/2LB PEEL & EAT SHRIMP</span>
                  <span className="text-xl text-[#ffcc00] ml-8">12.99</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">1LB PEEL & EAT SHRIMP</span>
                  <span className="text-xl text-[#ffcc00] ml-8">16.99</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">CHICKEN PHILLY</span>
                  <span className="text-xl text-[#ffcc00] ml-8">8.99</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">MANDARIN SALAD</span>
                  <span className="text-xl text-[#ffcc00] ml-8">8.99</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">+ ADD CHICKEN</span>
                  <span className="text-xl text-[#ffcc00] ml-8">3.00</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">STEAK PHILLY</span>
                  <span className="text-xl text-[#ffcc00] ml-8">8.99</span>
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div>
              <h2 className="text-5xl mb-6 text-[#ffcc00] font-amithen italic">
                Saturday
              </h2>
              <div className="space-y-2.5 font-oswald">
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">8oz FLAT IRON STEAK</span>
                  <span className="text-xl text-[#ffcc00] ml-8">21.99</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">FETTUCCINE ALFREDO</span>
                  <span className="text-xl text-[#ffcc00] ml-8">11.50</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">+ ADD CHICKEN</span>
                  <span className="text-xl text-[#ffcc00] ml-8">2.00</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">+ ADD SHRIMP</span>
                  <span className="text-xl text-[#ffcc00] ml-8">4.00</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">STEAK SANDWICH</span>
                  <span className="text-xl text-[#ffcc00] ml-8">10.49</span>
                </div>
              </div>
            </div>

            {/* Sunday */}
            <div>
              <h2 className="text-5xl mb-6 text-[#ffcc00] font-amithen italic">
                Sunday
              </h2>
              <div className="space-y-2.5 font-oswald">
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">GROUPER BASKET</span>
                  <span className="text-xl text-[#ffcc00] ml-8">10.49</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl flex-1">WING DING</span>
                  <span className="text-xl text-[#ffcc00] ml-8">10.99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Happy Hour */}
          <div className="mt-16 text-left px-8">
            <h2 className="text-6xl mb-1 text-[#ffcc00] font-amithen">
              Happy Hour
            </h2>
            <h3 className="text-5xl mb-2 text-[#ffcc00] font-amithen">
              Drinks
            </h3>
            <div className="text-2xl text-[#00ff00] mb-6 font-oswald tracking-widest">
              WED-SAT 2-5PM • SUNDAY ALL DAY
            </div>
            <div className="space-y-2 text-2xl font-oswald tracking-wide">
              <div>2.00 BOTTLE BEER</div>
              <div>3.00 DRAFT BEER</div>
              <div>3.00 WELL DRINKS</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pb-6 flex items-center justify-center gap-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/icon-logo.png"
              alt="OH TOMMY'S Logo"
              width={65}
              height={65}
              className="object-contain"
            />
            <Image
              src="/images/ohtommys-text.png"
              alt="OH TOMMY'S PUB & GRILL"
              width={200}
              height={45}
              className="object-contain"
            />
          </div>
          <div className="text-[#ffcc00] text-2xl font-oswald tracking-wider">
            7 MILES WEST ON 7 HWY FROM GREENVIEW
          </div>
        </div>
      </div>
    </div>
  )
} 