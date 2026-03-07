import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function DashboardScrollSection() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">
              Intuitive Dashboard.
              <br />
              <span className="text-4xl md:text-[5rem] font-black mt-1 leading-none text-orange-500">
                Effortless Applications.
              </span>
            </h2>
            <p className="text-base text-gray-600 mt-6 max-w-2xl mx-auto">
              Our dashboard makes job applications feel like a breeze. Track every application, 
              manage follow-ups, and watch your career progress—all in one beautiful interface.
            </p>
          </>
        }
      >
        <img
          src="/dash.jpeg"
          alt="APPLYZERDashboard - Intuitive job application management"
          className="mx-auto rounded-2xl object-cover h-full object-left-top w-full"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
