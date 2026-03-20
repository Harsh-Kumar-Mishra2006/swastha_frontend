import { Award, Trophy, Users, Globe, TrendingUp, Target } from "lucide-react";

const ProgramsAchievements = () => {
  const achievements = [
    {
      icon: Trophy,
      value: "Best HealthTech 2024",
      label: "Digital Health Award",
    },
    { icon: Users, value: "500K+", label: "Registered Users" },
    { icon: Globe, value: "25+", label: "Cities Covered" },
    { icon: TrendingUp, value: "98%", label: "Patient Satisfaction" },
  ];

  const programs = [
    {
      title: "Free Health Checkup Camps",
      description: "Regular health camps in rural and underserved areas",
      beneficiaries: "50,000+ people",
      icon: Target,
    },
    {
      title: "Women Health Initiative",
      description: "Specialized healthcare programs for women",
      beneficiaries: "25,000+ women",
      icon: Award,
    },
    {
      title: "Child Vaccination Drive",
      description: "Ensuring every child gets essential vaccinations",
      beneficiaries: "30,000+ children",
      icon: Target,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-neutral-100 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Achievements */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Achievements
          </h2>
          <p className="text-xl text-gray-600">
            Recognition that drives us to do better
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {achievements.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex p-4 bg-teal-100 rounded-2xl text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {item.value}
              </div>
              <div className="text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Programs */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4 text-center">
            Our Community Programs
          </h3>
          <p className="text-xl text-teal-100 mb-12 text-center">
            Making healthcare accessible to all
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-colors"
              >
                <program.icon className="h-12 w-12 mb-4" />
                <h4 className="text-xl font-semibold mb-3">{program.title}</h4>
                <p className="text-teal-100 mb-4">{program.description}</p>
                <p className="text-sm font-semibold">
                  Impact: {program.beneficiaries}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsAchievements;
