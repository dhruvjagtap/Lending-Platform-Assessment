using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly StatisticsService _statisticsService;
    private readonly LoanApplicationService _loanApplicationService;

    public StatisticsController(
        StatisticsService statisticsService,
        LoanApplicationService loanApplicationService)
    {
        _statisticsService = statisticsService;
        _loanApplicationService = loanApplicationService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] string? decision)
    {
        var totalApplicants = await _statisticsService.GetTotalApplicantCountAsync();

        var successfulApplicants = await _statisticsService.GetSuccessfulApplicantCountAsync();

        var declinedApplicants = await _statisticsService.GetDeclinedApplicantCountAsync();

        var totalLoanValue = await _statisticsService.GetTotalLoanValueAsync();

        var meanLtv = await _statisticsService.GetMeanLtvAsync();

        var statistics = new StatisticsResponse
        {
            TotalApplicants = totalApplicants,
            SuccessfulApplicants = successfulApplicants,
            DeclinedApplicants = declinedApplicants,
            TotalLoanValue = totalLoanValue,
            MeanLtv = meanLtv
        };

        List<LoanApplication> applications;

        if (string.IsNullOrEmpty(decision))
        {
            applications = await _loanApplicationService.GetAllLoanApplicationsAsync();
        }
        else
        {
            applications = await _loanApplicationService.GetLoanApplicationsByDecisionAsync(decision);
        }

        var response = new DashboardResponse
        {
            Statistics = statistics,
            Applications = applications
        };

        return Ok(response);
    }

    [HttpGet("successful-applicants-count")]
    public async Task<IActionResult> GetSuccessfulApplicantsCount()
    {
        var count = await _statisticsService.GetSuccessfulApplicantCountAsync();

        return Ok(count);
    }

    [HttpGet("declined-applicants-count")]
    public async Task<IActionResult> GetDeclinedApplicantsCount()
    {
        var count = await _statisticsService.GetDeclinedApplicantCountAsync();

        return Ok(count);
    }

    [HttpGet("total-loan-value")]
    public async Task<IActionResult> GetTotalLoanValue()
    {
        var totalLoanValue = await _statisticsService.GetTotalLoanValueAsync();

        return Ok(totalLoanValue);
    }

    [HttpGet("average-ltv")]
    public async Task<IActionResult> GetAverageLtv()
    {
        var averageLtv = await _statisticsService.GetMeanLtvAsync();

        return Ok(averageLtv);
    }
}
